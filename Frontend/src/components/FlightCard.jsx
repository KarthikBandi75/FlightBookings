import { useState, memo } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiMapPin, FiChevronDown, FiChevronUp, FiFilter, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const airlineImages = {
  Indigo: "✈",
  "Air India": "✈",
  default: "✈",
};

function FlightCard({ flight, filterAirline, onBook, onBookingAttempt, userData, token }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (filterAirline && flight.airline !== filterAirline) {
    return null;
  }

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration) => {
    if (!duration || typeof duration !== "string") {
      console.warn("Invalid duration:", duration);
      return "N/A";
    }
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (!match) {
      console.warn("Duration format invalid:", duration);
      return "N/A";
    }
    const hours = match[1] || 0;
    const minutes = match[2] || 0;
    return `${hours}h ${minutes ? minutes + "m" : ""}`.trim();
  };

  const displayAirline = filterAirline === "Indigo" ? "Indigo" : filterAirline === "Air India" ? "Air India" : flight.airline;
  const displayAirlineCode = filterAirline === "Indigo" ? "6E" : filterAirline === "Air India" ? "AI" : flight.airlineCode || "XX";
  const displayFlightNumber = `${displayAirlineCode}-${flight.flightNumber.split("-")[1] || "101"}`;

  const handleBookClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        "https://flightbookings-backend.onrender.com/api/flights/attempt",
        { flightId: flight.flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await onBookingAttempt(flight.flightId, response.data.currentPrice);
        setIsModalOpen(true);
      } else {
        toast.error(response.data.message || "Failed to fetch updated price");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch updated price");
    }
  };

  const handleConfirmBooking = async (e) => {
    e.stopPropagation();
    setIsBooking(true);
    try {
      const response = await axios.post(
        "https://flightbookings-backend.onrender.com/api/user/book",
        { flightId: flight.flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(`Booking successful! Booking ID: ${response.data.bookingId}`);
        onBook({
          flightId: flight.flightId,
          price: response.data.price,
          wallet: response.data.wallet,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book flight");
    } finally {
      setIsBooking(false);
    }
  };

  const airlineImage = airlineImages[displayAirline] || airlineImages.default;

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow w-full"
        onClick={() => setShowDetails(!showDetails)}
      >
        
        <div className="md:hidden flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F6F8] text-[#0A66C2] text-lg">
                {airlineImage}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1F2A44]">
                  {displayFlightNumber}
                </p>
                <p className="text-xs text-[#6B7280]">{displayAirline}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#1F2A44]">
                ₹{flight.price.toLocaleString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookClick(e);
                }}
                className="px-2 py-1 bg-[#0A66C2] text-white rounded text-xs font-semibold hover:bg-[#084C99] transition-colors cursor-pointer mt-1"
                disabled={isBooking}
              >
                Book
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="text-center">
              <p className="text-sm font-medium text-[#1F2A44]">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-xs text-[#6B7280]">{flight.origin}</p>
            </div>
            
            <div className="flex flex-col items-center px-2">
              <p className="text-xs text-[#6B7280]">{formatDuration(flight.duration)}</p>
              <div className="relative w-full flex justify-center">
                <div className="h-px w-full bg-gray-300 my-1"></div>
                <FiArrowRight className="absolute top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={16} />
              </div>
              <p className="text-xs text-[#6B7280]">Non-stop</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-[#1F2A44]">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-xs text-[#6B7280]">{flight.destination}</p>
            </div>
          </div>

          
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-[#1F2A44]">Departure</p>
                  <p className="text-[#6B7280]">{new Date(flight.departureTime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-[#1F2A44]">Arrival</p>
                  <p className="text-[#6B7280]">{new Date(flight.arrivalTime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-[#1F2A44]">Flight Number</p>
                  <p className="text-[#6B7280]">{displayFlightNumber}</p>
                </div>
                <div>
                  <p className="font-medium text-[#1F2A44]">Aircraft</p>
                  <p className="text-[#6B7280]">A320</p>
                </div>
              </div>
            </div>
          )}

          <button 
            className="flex items-center justify-center gap-1 text-xs text-[#0A66C2] mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
          >
            {showDetails ? (
              <>
                <FiChevronUp size={14} /> Hide details
              </>
            ) : (
              <>
                <FiChevronDown size={14} /> View details
              </>
            )}
          </button>
        </div>

      
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
          <div className="flex items-center space-x-3 sm:min-w-[150px] lg:min-w-[200px]">
            <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-[#F4F6F8] text-[#0A66C2] text-lg sm:text-xl lg:text-2xl">
              {airlineImage}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#1F2A44]">
                {displayFlightNumber} • {displayAirline}
              </p>
              <p className="text-xs text-[#6B7280] flex items-center gap-1">
                <FiClock size={12} /> {formatTime(flight.departureTime)} • {flight.originAirport || flight.origin}, {flight.origin}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:text-center sm:min-w-[60px] lg:min-w-[80px]">
            <p className="text-xs sm:text-sm text-[#6B7280]">{formatDuration(flight.duration)}</p>
            <div className="flex items-center gap-1">
              <FiMapPin size={12} className="text-[#6B7280]" />
              <FiArrowRight className="text-[#6B7280]" size={16} />
              <FiMapPin size={12} className="text-[#6B7280]" />
            </div>
            <p className="text-xs text-[#6B7280] hidden sm:block">
              {flight.originAirport || flight.origin} → {flight.destinationAirport || flight.destination}
            </p>
          </div>
          <div className="text-right sm:min-w-[100px] lg:min-w-[120px]">
            <p className="text-xs sm:text-sm text-[#6B7280] flex items-center justify-end gap-1">
              <FiClock size={12} /> {formatTime(flight.arrivalTime)} • {flight.destinationAirport || flight.destination}, {flight.destination}
            </p>
          </div>
          <div className="flex justify-between items-center sm:block sm:text-right sm:min-w-[80px] lg:min-w-[100px]">
            <p className="text-sm sm:text-lg font-bold text-[#1F2A44]">
              ₹{flight.price.toLocaleString()}
            </p>
            <button
              onClick={handleBookClick}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0A66C2] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#084C99] transition-colors cursor-pointer"
              disabled={isBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </motion.div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        flight={flight}
        userWallet={userData?.wallet || 0}
        isBooking={isBooking}
      />
    </>
  );
}

export default memo(FlightCard, (prevProps, nextProps) => {
  return (
    prevProps.flight.flightId === nextProps.flight.flightId &&
    prevProps.flight.price === nextProps.flight.price &&
    prevProps.filterAirline === nextProps.filterAirline &&
    prevProps.userData?.wallet === nextProps.userData?.wallet &&
    prevProps.token === nextProps.token
  );
});