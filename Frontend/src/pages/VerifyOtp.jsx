import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://flightbookings-backend.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });
      setToken(response.data.token);
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      await axios.post("https://flightbookings-backend.onrender.com/api/auth/forgot-password", {
        email,
      });
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-[#F4F6F8] px-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 text-center">Verify OTP</h2>
        <p className="text-center text-sm text-[#6B7280] mb-4">OTP sent to {email}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#1F2A44] mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
                required
                disabled={loading || resendLoading}
              />
            </div>
            <div className="self-end">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendLoading}
                className="py-2 px-4 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-colors disabled:bg-[#F59E0B]/50 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {resendLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || resendLoading}
            className="w-full py-2 bg-[#00A69C] text-white rounded-lg font-semibold hover:bg-[#008C84] transition-colors disabled:bg-[#00A69C]/50 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                />
              </svg>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default VerifyOtp;