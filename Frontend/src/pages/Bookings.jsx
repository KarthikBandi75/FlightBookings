import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import { FiDownload, FiClock, FiCalendar, FiMapPin, FiAward, FiCheckCircle } from "react-icons/fi";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, type: "spring", stiffness: 200 } },
};

function Bookings() {
  const { token, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState({});

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://flightbookings-backend.onrender.com/api/user/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, navigate]);

  const generatePDF = async (booking) => {
    setPdfLoading((prev) => ({ ...prev, [booking._id]: true }));
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm"
      });
  
      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, 297, 210, "F");
  
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, 10, 277, 190, 5, 5, "FD");
  
      doc.setFillColor(0, 114, 188); 
      doc.roundedRect(10, 10, 277, 30, 5, 5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(`${booking.airline} - Flight Ticket`, 20, 28);
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("FLIGHT DETAILS", 20, 50);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      
      const flightDetails = [
        { label: "Flight Number", value: booking.flightNumber },
        { label: "Route", value: `${booking.origin} to ${booking.destination}` }, 
        { label: "Departure", value: new Date(booking.departureTime).toLocaleString("en-US", { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        }) },
        { label: "Arrival", value: new Date(booking.arrivalTime).toLocaleString("en-US", { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        }) },
        { label: "Duration", value: formatDuration(booking.duration) },
        { label: "Class", value: "Economy" },
        { label: "Seat", value: `A${Math.floor(Math.random() * 30) + 1}` },
        { label: "Gate", value: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}` }
      ];
  
      flightDetails.forEach((detail, index) => {
        const col = index < 4 ? 20 : 100;
        const row = 60 + (index % 4) * 10;
        doc.text(`${detail.label}:`, col, row);
        doc.setFont("helvetica", "bold");
        doc.text(detail.value, col + 25, row);
        doc.setFont("helvetica", "normal");
      });
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("PASSENGER DETAILS", 180, 50);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      
      const passengerDetails = [
        { label: "Name", value: userData?.name || "N/A" },
        { label: "Email", value: userData?.email || "N/A" },
        { label: "Booking ID", value: booking._id },
        { label: "Booking Date", value: formatDate(booking.createdAt) },
        { label: "Price", value: `${booking.price.toLocaleString()}` }, 
        { label: "Status", value: "Confirmed" }
      ];
  
      passengerDetails.forEach((detail, index) => {
        const col = 180;
        const row = 60 + index * 10;
        doc.text(`${detail.label}:`, col, row);
        doc.setFont("helvetica", "bold");
        doc.text(detail.value, col + 25, row);
        doc.setFont("helvetica", "normal");
      });
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("BOARDING PASS", 20, 120);
      
      for (let i = 0; i < 30; i++) {
        const height = 5 + Math.random() * 15;
        doc.rect(20 + (i * 5), 125, 3, height, "F");
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(booking._id, 40, 145);
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Terms & Conditions:", 20, 160);
      doc.text("- This is an electronic ticket. No printout required.", 20, 165);
      doc.text("- Please carry a valid government ID proof for verification.", 20, 170);
      doc.text("- Check-in begins 3 hours before departure.", 20, 175);
      doc.text("- Gates close 45 minutes before departure time.", 20, 180);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 114, 188);
      doc.text("Thank you for choosing us! Safe travels!", 20, 190);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("For any queries, contact: support@cloudTrip.com | +91 9087860727", 20, 195);
     
      
      doc.setFillColor(200, 200, 200);
      doc.roundedRect(230, 120, 50, 20, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(booking.airline, 235, 133);
  
      doc.save(`BoardingPass_${booking.flightNumber}_${userData?.name?.split(' ')[0] || 'Passenger'}.pdf`);
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
      console.error(error);
    } finally {
      setPdfLoading((prev) => ({ ...prev, [booking._id]: false }));
    }
  };

  const formatDuration = (duration) => {
    if (!duration || typeof duration !== "string") {
      return "N/A";
    }
    const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
    if (!match) {
      return "N/A";
    }
    const hours = match[1] || 0;
    const minutes = match[2] || 0;
    return `${hours}h ${minutes ? minutes + "m" : ""}`.trim();
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="bg-[#0A66C2] text-white sm:text-xs md:text-sm px-2 py-1 rounded-full flex items-center gap-1"><FiCheckCircle size={12} /> Confirmed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Cancelled</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Unknown</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-7 px-5 sm:px-6 lg:px-8 bg-[#F4F6F8]"
    >
      <div className="max-w-6xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-[#1F2A44] mb-6">Your Bookings</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A69C]"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FiAward size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-[#1F2A44] mb-2">No bookings yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">You haven't made any bookings yet. Start exploring flights to book your next trip!</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-[#00A69C] text-white rounded-md hover:bg-[#008C84] transition-colors"
            >
              Browse Flights
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm text-[#1F2A44]">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-3 px-4 font-medium">Flight</th>
                    <th className="py-3 px-4 font-medium">Route</th>
                    <th className="py-3 px-4 font-medium">Date & Time</th>
                    <th className="py-3 px-4 font-medium">Duration</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{booking.airline}</div>
                        <div className="text-xs text-gray-500">{booking.flightNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{booking.origin} → {booking.destination}</div>
                        <div className="text-xs text-gray-500">{formatDate(booking.departureTime)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <FiClock size={14} className="text-gray-500" />
                          <span>{formatTime(booking.departureTime)} - {formatTime(booking.arrivalTime)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDuration(booking.duration)}</td>
                      <td className="py-3 px-4 font-medium">₹{booking.price.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge('confirmed')}
                      </td>
                      <td className="py-3 px-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => generatePDF(booking)}
                          disabled={pdfLoading[booking._id]}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#00A69C] text-white rounded-md text-sm font-medium hover:bg-[#008C84] disabled:bg-[#00A69C]/50 cursor-pointer"
                        >
                          <FiDownload size={16} />
                          Download Ticket
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#1F2A44]">{booking.airline}</h3>
                        <p className="text-xs text-gray-500">{booking.flightNumber}</p>
                      </div>
                      <div>
                        {getStatusBadge('confirmed')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-lg font-bold">{booking.origin}</div>
                        <div className="text-xs text-gray-500">Departure</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          {formatDuration(booking.duration)}
                        </div>
                        <div className="w-16 h-px bg-gray-300 my-1"></div>
                        <div className="text-xs text-gray-500">Non-stop</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{booking.destination}</div>
                        <div className="text-xs text-gray-500">Arrival</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={14} className="text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">{formatDate(booking.departureTime)}</div>
                          <div className="text-xs text-gray-500">Travel date</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock size={14} className="text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">{formatTime(booking.departureTime)} - {formatTime(booking.arrivalTime)}</div>
                          <div className="text-xs text-gray-500">Duration</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500">Total Price</div>
                        <div className="font-bold text-[#1F2A44]">₹{booking.price.toLocaleString()}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => generatePDF(booking)}
                        disabled={pdfLoading[booking._id]}
                        className="flex items-center gap-1 px-3 py-2 bg-[#00A69C] text-white rounded-md text-sm font-medium hover:bg-[#008C84] disabled:bg-[#00A69C]/50 cursor-pointer"
                      >
                        <FiDownload size={16} />
                        Download Ticket
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Bookings;