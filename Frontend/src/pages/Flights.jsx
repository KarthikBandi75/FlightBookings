import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import AutoSuggest from "../components/AutoSuggest.jsx";
import FlightCard from "../components/FlightCard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiLoader, FiSearch, FiFilter, FiX, FiDollarSign, FiClock, FiTrendingUp } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

const loadingVariants = {
  animate: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.8 } },
};

const emptyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
};

function Flights() {
  const { token, userData, setUserData, isLoadingProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterAirline, setFilterAirline] = useState("");
  const [availableAirlines, setAvailableAirlines] = useState([]);
  const [hasLoadedInitialSearch, setHasLoadedInitialSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [durationRange, setDurationRange] = useState([0, 24]);
  const [departureTimeRange, setDepartureTimeRange] = useState(["00:00", "23:59"]);
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = useCallback(
    async (e, isInitialLoad = false) => {
      e.preventDefault();
      if (!from || !to) {
        if (!isInitialLoad) {
          toast.error("Please select both origin and destination");
        }
        return;
      }
      if (!departureDate) {
        if (!isInitialLoad) {
          toast.error("Please select a departure date");
        }
        return;
      }
      setLoading(true);

      const formattedDate = departureDate.toISOString().split("T")[0];
      try {
        const response = await axios.get(
          `https://flightbookings-backend.onrender.com/api/flights?origin=${from}&destination=${to}&departureDate=${formattedDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.length !== 10) {
          toast.warn(`Expected 10 flights, received ${response.data.length}`);
        }
        setFlights(response.data);
        const airlines = [...new Set(response.data.map(f => f.airline))];
        setAvailableAirlines(airlines);
        sessionStorage.setItem(
          "flightSearch",
          JSON.stringify({ from, to, departureDate: departureDate.toISOString() })
        );
        sessionStorage.setItem("flightsData", JSON.stringify(response.data));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch flights. Please try again.");
      } finally {
        setLoading(false);
        if (isInitialLoad) {
          setHasLoadedInitialSearch(true);
        }
      }
    },
    [from, to, departureDate, token]
  );

  useEffect(() => {
    let isMounted = true;
    if (!token) {
      toast.error("Please login to search flights");
      navigate("/login");
      return;
    }

    if (location.pathname === "/flights" && !isLoadingProfile && !hasLoadedInitialSearch) {
      const savedSearch = sessionStorage.getItem("flightSearch");
      const savedFlights = sessionStorage.getItem("flightsData");
      if (savedSearch) {
        const { from: savedFrom, to: savedTo, departureDate: savedDate } = JSON.parse(savedSearch);
        if (savedFrom && savedTo && savedDate) {
          if (savedFrom !== from) setFrom(savedFrom);
          if (savedTo !== to) setTo(savedTo);
          if (new Date(savedDate).getTime() !== departureDate.getTime()) {
            setDepartureDate(new Date(savedDate));
          }

          if (savedFlights && isMounted) {
            const parsedFlights = JSON.parse(savedFlights);
            setFlights(parsedFlights);
            const airlines = [...new Set(parsedFlights.map(f => f.airline))];
            setAvailableAirlines(airlines);
            setHasLoadedInitialSearch(true);
          } else if (isMounted) {
            handleSearch({ preventDefault: () => {} }, true);
          }
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [token, navigate, location.pathname, isLoadingProfile, hasLoadedInitialSearch, from, to, departureDate, handleSearch]);

  useEffect(() => {
    return () => {
      if (location.pathname !== "/flights") {
        sessionStorage.removeItem("flightSearch");
        sessionStorage.removeItem("flightsData");
        setFlights([]);
        setFrom("");
        setTo("");
        setDepartureDate(() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow;
        });
        setFilterAirline("");
        setAvailableAirlines([]);
        setHasLoadedInitialSearch(false);
      }
    };
  }, [location.pathname]);

  const refreshFlightPrice = useCallback((flightId, updatedPrice) => {
    setFlights((prevFlights) => {
      const newFlights = prevFlights.map((flight) =>
        flight.flightId === flightId ? { ...flight, price: updatedPrice } : flight
      );
      setTimeout(() => sessionStorage.setItem("flightsData", JSON.stringify(newFlights)), 0);
      return newFlights;
    });
  }, []);

  const handleBook = useCallback(
    (bookingData) => {
      setUserData((prev) => ({ ...prev, wallet: bookingData.wallet }));
      setFlights((prevFlights) => {
        const newFlights = prevFlights.map((flight) =>
          flight.flightId === bookingData.flightId ? { ...flight, price: bookingData.price } : flight
        );
        setTimeout(() => sessionStorage.setItem("flightsData", JSON.stringify(newFlights)), 0);
        return newFlights;
      });
    },
    [setUserData]
  );

  const clearData = useCallback(() => {
    setFrom("");
    setTo("");
    setDepartureDate(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    });
    setFilterAirline("");
    setFlights([]);
    setAvailableAirlines([]);
    sessionStorage.removeItem("flightSearch");
    sessionStorage.removeItem("flightsData");
    setHasLoadedInitialSearch(false);
    setShowFilters(false);
    setPriceRange([0, 50000]);
    setDurationRange([0, 24]);
    setDepartureTimeRange(["00:00", "23:59"]);
    setSortBy("price");
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredFlights = flights
    .filter(flight => !filterAirline || flight.airline === filterAirline)
    .filter(flight => flight.price >= priceRange[0] && flight.price <= priceRange[1])
    .filter(flight => {
      const durationHours = parseInt(flight.duration.match(/PT(\d+)H/)?.[1] || 0);
      return durationHours >= durationRange[0] && durationHours <= durationRange[1];
    })
    .filter(flight => {
      const flightTime = formatTime(flight.departureTime);
      return flightTime >= departureTimeRange[0] && flightTime <= departureTimeRange[1];
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          const aHours = parseInt(a.duration.match(/PT(\d+)H/)?.[1] || 0);
          const bHours = parseInt(b.duration.match(/PT(\d+)H/)?.[1] || 0);
          return aHours - bHours;
        case "departure":
          return new Date(a.departureTime) - new Date(b.departureTime);
        default:
          return 0;
      }
    });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-7 px-5 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-6xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-[#1F2A44] mb-6 ">Book Your Flight</h2>
        <form
          onSubmit={(e) => handleSearch(e, false)}
          className="bg-white shadow-sm rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={formVariants} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">From</label>
            <AutoSuggest
              label="From (e.g., DEL)"
              value={from}
              onChange={setFrom}
              token={token}
              className="border border-gray-200 p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
            />
          </motion.div>
          <motion.div variants={formVariants} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">To</label>
            <AutoSuggest
              label="To (e.g., BOM)"
              value={to}
              onChange={setTo}
              token={token}
              className="border border-gray-200 p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
            />
          </motion.div>
          <motion.div variants={formVariants} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">Departure Date</label>
            <div className="relative">
              <DatePicker
                selected={departureDate}
                onChange={(date) => date && setDepartureDate(date)}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="border border-gray-200 p-2 pl-10 rounded-lg w-full bg-white focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
                calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
                placeholderText="Select date"
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={16} />
            </div>
          </motion.div>
          <motion.div variants={formVariants} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">Filter by Airline</label>
            <select
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
            >
              <option value="">All Airlines</option>
              {availableAirlines.map((airline) => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </motion.div>
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.5 }}
            className="sm:col-span-2 lg:col-span-4 flex justify-center lg:justify-start gap-4"
          >
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-[#00A69C] text-white rounded-lg font-semibold hover:bg-[#008C84] transition-colors disabled:bg-[#00A69C]/50 text-sm w-full sm:w-auto cursor-pointer"
            >
              {loading ? (
                <FiLoader className="animate-spin" size={16} />
              ) : (
                <FiSearch  size={16} />
              )}
              Search Flights
            </button>
            <button
              type="button"
              onClick={clearData}
              className="flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-colors text-sm w-full sm:w-auto cursor-pointer"
            >
              Clear Data
            </button>
          </motion.div>
        </form>

       
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#1F2A44]">
              {filteredFlights.length} flights found
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
              >
                {showFilters ? <FiX size={16} /> : <FiFilter size={16} />}
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#00A69C] focus:border-transparent"
              >
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
                <option value="departure">Sort by Departure</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className=" text-sm font-medium text-[#1F2A44] mb-2 flex items-center gap-1">
                    <FiDollarSign size={14} /> Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <span className="text-sm text-[#6B7280]">₹{priceRange[0].toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <span className="text-sm text-[#6B7280]">₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className=" text-sm font-medium text-[#1F2A44] mb-2 flex items-center gap-1">
                    <FiClock size={14} /> Duration (hours)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={durationRange[0]}
                      onChange={(e) => setDurationRange([parseInt(e.target.value), durationRange[1]])}
                      className="w-full"
                    />
                    <span className="text-sm text-[#6B7280]">{durationRange[0]}h</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={durationRange[1]}
                      onChange={(e) => setDurationRange([durationRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <span className="text-sm text-[#6B7280]">{durationRange[1]}h</span>
                  </div>
                </div>

                <div>
                  <label className=" text-sm font-medium text-[#1F2A44] mb-2 flex items-center gap-1">
                    <FiTrendingUp size={14} /> Departure Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[#6B7280]">From</label>
                      <input
                        type="time"
                        value={departureTimeRange[0]}
                        onChange={(e) => setDepartureTimeRange([e.target.value, departureTimeRange[1]])}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280]">To</label>
                      <input
                        type="time"
                        value={departureTimeRange[1]}
                        onChange={(e) => setDepartureTimeRange([departureTimeRange[0], e.target.value])}
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              variants={loadingVariants}
              animate="animate"
              className="text-center"
            >
              <FiLoader className="text-[#00A69C] text-4xl mx-auto" />
              <p className="text-[#6B7280] mt-2 text-sm">Finding the best flights for you...</p>
            </motion.div>
          ) : filteredFlights.length === 0 ? (
            <motion.div
              variants={emptyVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <p className="text-[#6B7280] text-sm mb-4">No flights found. Try a different search.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFlights.map((flight, index) => (
                <motion.div
                  key={flight.flightId}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <FlightCard
                    flight={flight}
                    filterAirline={filterAirline}
                    onBook={handleBook}
                    onBookingAttempt={refreshFlightPrice}
                    userData={userData}
                    token={token}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Flights;