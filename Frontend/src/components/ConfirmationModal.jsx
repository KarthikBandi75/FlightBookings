import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

function ConfirmationModal({ isOpen, onClose, onConfirm, flight, userWallet, isBooking }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm(e);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#1F2A44]">Confirm Booking</h2>
          <button onClick={onClose} className="text-[#6B7280]">
            <FiX size={20} />
          </button>
        </div>
        <p className="text-sm text-[#6B7280] mb-2">
          Flight: {flight.airline} {flight.flightNumber}
        </p>
        <p className="text-sm text-[#6B7280] mb-2">
          Route: {flight.origin} → {flight.destination}
        </p>
        <p className="text-sm text-[#6B7280] mb-2">
          Price: ₹{flight.price.toLocaleString()}
        </p>
        <p className="text-sm text-[#6B7280] mb-4">
          Wallet Balance: ₹{userWallet.toLocaleString()}
        </p>
        {userWallet < flight.price && (
          <p className="text-sm text-red-500 mb-4">Insufficient wallet balance</p>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-[#1F2A44] rounded-lg text-sm font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#00A69C] text-white rounded-lg text-sm font-semibold hover:bg-[#008C84] disabled:bg-[#00A69C]/50"
            disabled={isBooking || userWallet < flight.price}
          >
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConfirmationModal;