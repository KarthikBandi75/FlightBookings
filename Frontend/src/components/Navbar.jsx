import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import { LayoutDashboard, Briefcase, User } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";
const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1,
      when: "beforeChildren"
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
};

function Navbar() {
  const { token, setToken, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/flights", label: "Search Flights", icon: <LayoutDashboard size={20} /> },
    { to: "/bookings", label: "My Bookings", icon: <Briefcase size={20} /> },
    {
      label: `₹${userData?.wallet?.toLocaleString() || '50,000'}`,
      icon: <User size={20} />,
      isWallet: true,
    },
  ];

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className=" top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="flex items-center"
        >
          <Link
            to="/"
            className="flex items-center space-x-3 text-xl font-semibold text-gray-800"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
            >
              
            </motion.span>
            <span><img src={assets.cloud} alt="" /></span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {token ? (
            <>
              {navItems.map(({ to, label, icon, isWallet }) => (
                <motion.div
                  key={to || label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {isWallet ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 bg-blue-50">
                      {icon}
                      <span className="font-semibold">{label}</span>
                    </div>
                  ) : (
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium ${
                          isActive 
                            ? "text-[#00A69C] bg-blue-50" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {icon}
                      {label}
                    </NavLink>
                  )}
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2.5 bg-[#00A69C] text-white rounded-lg text-base font-medium hover:bg-[#008C84] transition-colors cursor-pointer"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-base font-medium ${
                      isActive 
                        ? "text-[#00A69C] bg-blue-50" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  Login
                </NavLink>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `px-5 py-2.5 bg-[#00A69C] text-white rounded-lg text-base font-medium hover:bg-[#008C84] ${
                      isActive ? "ring-2 ring-[#00A69C] ring-offset-2" : ""
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-white border-t border-gray-100 px-6 py-4 shadow-inner"
          >
            <div className="flex flex-col space-y-4">
              {token ? (
                <>
                  {navItems.map(({ to, label, icon, isWallet }) => (
                    <motion.div 
                      key={to || label} 
                      variants={itemVariants}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      {isWallet ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 bg-blue-50">
                          {icon}
                          <span className="font-semibold">Wallet: {label}</span>
                        </div>
                      ) : (
                        <NavLink
                          to={to}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                              isActive 
                                ? "text-[#00A69C] bg-blue-50" 
                                : "text-gray-600 hover:bg-gray-50"
                            }`
                          }
                        >
                          {icon}
                          {label}
                        </NavLink>
                      )}
                    </motion.div>
                  ))}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full mt-2 px-5 py-3 bg-[#00A69C] text-white rounded-lg text-base font-medium hover:bg-[#008C84] transition-colors cursor-pointer"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants} className="border-b border-gray-100 pb-4">
                    <NavLink
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-medium ${
                          isActive 
                            ? "text-[#00A69C] bg-blue-50" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-3 bg-[#00A69C] text-white rounded-lg text-base font-medium hover:bg-[#008C84] ${
                          isActive ? "ring-2 ring-[#00A69C] ring-offset-2" : ""
                        }`
                      }
                    >
                      Sign Up
                    </NavLink>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;