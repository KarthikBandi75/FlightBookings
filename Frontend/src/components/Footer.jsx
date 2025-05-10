import { motion } from "framer-motion";
import { FiTwitter, FiFacebook, FiInstagram } from "react-icons/fi";


const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Footer() {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1E293B] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
       
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#F59E0B] mb-4">
            Company
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/flights" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                Search Flights
              </a>
            </li>
            <li>
              <a href="/bookings" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                Bookings
              </a>
            </li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#F59E0B] mb-4">
            Support
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/faq" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="/contact" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/terms" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

     
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#F59E0B] mb-4">
            Contact
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-2">
            Phone: +91 9087860727
          </p>
          <p className="text-sm sm:text-base text-gray-300 mb-4">
            Email: support@cloudTrip.com
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" className="text-gray-300 hover:text-[#F59E0B] transition-colors">
              <FiTwitter size={20} />
            </a>
            <a href="https://facebook.com" className="text-gray-300 hover:text-[#F59E0B] transition-colors">
              <FiFacebook size={20} />
            </a>
            <a href="https://instagram.com" className="text-gray-300 hover:text-[#F59E0B] transition-colors">
              <FiInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 sm:mt-12 border-t border-gray-700 pt-6 text-center">
        <p className="text-sm sm:text-base text-gray-300">
          © 2025 Flight Booking. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;