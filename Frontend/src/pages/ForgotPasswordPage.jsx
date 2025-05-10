import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("email"); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("https://flightbookings-backend.onrender.com/api/auth/forgot-password", { email });
      toast.success(response.data.message);
      setStep("otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("https://flightbookings-backend.onrender.com/api/auth/verify-forgot-otp", {
        email,
        otp,
      });
      toast.success(response.data.message);
      setStep("password");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("https://flightbookings-backend.onrender.com/api/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 text-center">Reset Your Password</h2>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2A44] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#00A69C] text-white rounded-lg font-semibold hover:bg-[#008C84] transition-colors disabled:bg-[#00A69C]/50 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                </svg>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2A44] mb-1">OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm "
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-colors disabled:bg-[#F59E0B]/50 text-sm cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#00A69C] text-white rounded-lg font-semibold hover:bg-[#008C84] transition-colors disabled:bg-[#00A69C]/50 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                </svg>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2A44] mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#00A69C] text-white rounded-lg font-semibold hover:bg-[#008C84] transition-colors disabled:bg-[#00A69C]/50 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                </svg>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;