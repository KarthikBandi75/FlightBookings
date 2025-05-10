import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://flightbookings-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      setToken(response.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
        <h2 className="text-2xl font-bold text-[#1F2A44] mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1F2A44] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A69C] focus:border-transparent text-[#6B7280] text-sm"
              required
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
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-md text-[#6B7280]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#F59E0B] hover:underline">
            Signup
          </Link>
        </p>
        <p className="mt-2 text-center text-md text-[#6B7280]">
          Forgot Password?{" "}
          <Link to="/forgot-password" className="text-[#F59E0B] hover:underline">
            Reset Password
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;