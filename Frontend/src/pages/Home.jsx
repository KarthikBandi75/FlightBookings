import { useContext,useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaPlane, FaRegClock, FaRegMoneyBillAlt, FaChartLine, FaSearch, FaWallet, FaTicketAlt } from "react-icons/fa";
import { FiUsers, FiGlobe, FiArrowDown } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { useAnimation } from "framer-motion";
const HeroSection = () => {
  const { token } = useContext(AuthContext);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const planeVariants = {
    initial: { x: '100vw', opacity: 0 },
    animate: {
      x: '30vw',
      y: ["0%", "3%", "0%"],
      opacity: 0.1,
      transition: {
        x: { duration: 3, ease: "linear" },
        y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
        opacity: { duration: 3 }
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={planeVariants}
        className="absolute -right-20 top-1/3 opacity-10 text-[#00A69C] text-[300px] z-0"
      >
        <FaPlane />
      </motion.div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          <span className="text-[#00A69C]">Fly Smart,</span> Travel Easy
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Discover the best flight deals with real-time pricing and seamless booking experience
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {token ? (
            <Link
              to="/flights"
              className="px-8 py-4 bg-[#00A69C] hover:bg-[#008C84] text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            >
              Search Flights
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-4 bg-[#00A69C] hover:bg-[#008C84] text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

const StatsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const stats = [
    { value: "10,000+", label: "Flights Daily", icon: <FaPlane className="text-blue-600 text-2xl" /> },
    { value: "50+", label: "Airlines", icon: <FiGlobe className="text-purple-600 text-2xl" /> },
    { value: "1M+", label: "Happy Travelers", icon: <FiUsers className="text-green-600 text-2xl" /> },
    { value: "24/7", label: "Support", icon: <FaRegClock className="text-amber-600 text-2xl" /> },
  ];

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
          Our Flight Network
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const features = [
    {
      icon: <FaSearch className="text-blue-600 text-4xl" />,
      title: "Smart Flight Search",
      description: "Auto-suggest airports and cities with our intuitive search API for effortless planning.",
    },
    {
      icon: <FaRegMoneyBillAlt className="text-purple-600 text-4xl" />,
      title: "Dynamic Pricing",
      description: "Real-time price adjustments ensure you get the best deals on your preferred flights.",
    },
    {
      icon: <FaWallet className="text-green-600 text-4xl" />,
      title: "Virtual Wallet",
      description: "Start with ₹50,000 to book flights instantly with our secure wallet system.",
    },
    {
      icon: <FaTicketAlt className="text-amber-600 text-4xl" />,
      title: "Instant E-Tickets",
      description: "Download PDF tickets immediately after booking for hassle-free travel.",
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center']
  });
  const [roadHeight, setRoadHeight] = useState(0);

  useEffect(() => {
    const updateRoadHeight = () => {
      const roadElement = document.getElementById('timeline-road');
      if (roadElement) setRoadHeight(roadElement.clientHeight);
    };

    updateRoadHeight();
    window.addEventListener('resize', updateRoadHeight);
    return () => window.removeEventListener('resize', updateRoadHeight);
  }, []);

  const planeY = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [roadHeight * 0.1, roadHeight * 0.9 - 48]
  );

  const steps = [
    {
      number: "1",
      title: "Secure OTP Login",
      description: "Sign up or log in with your email. A secure OTP will be sent for verification.",
      position: "left"
    },
    {
      number: "2",
      title: "Smart Flight Search",
      description: "Use our auto-suggest API to find flights by city or airport with ease.",
      position: "right"
    },
    {
      number: "3",
      title: "Dynamic Pricing",
      description: "See real-time prices that adjust based on demand.",
      position: "left"
    },
    {
      number: "4",
      title: "Wallet Booking",
      description: "Book instantly using your ₹50,000 wallet balance.",
      position: "right"
    },
    {
      number: "5",
      title: "E-Ticket Download",
      description: "Download your ticket as PDF immediately after booking.",
      position: "left"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16 text-center">
          How It Works
        </h2>

        {/* Mobile View */}
        <div className="md:hidden w-full">
          <div className="flex flex-col items-center space-y-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                  <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Step {step.number}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center">
                    <FiArrowDown className="w-8 h-8 text-[#00A69C] animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div ref={timelineRef} className="hidden md:block relative w-full max-w-4xl mx-auto">
          <div id="timeline-road" className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full">
            <motion.div 
              style={{ y: planeY }}
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00A69C] rounded-full flex items-center justify-center"
            >
              <FaPlane className="text-white text-xl" />
            </motion.div>
          </div>

          <div className="flex flex-col w-full space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: step.position === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex ${step.position === 'left' ? 'justify-start' : 'justify-end'} relative`}
              >
                <div className={`absolute ${step.position === 'left' ? 'left-[calc(50%-60px)]' : 'right-[calc(50%-60px)]'} h-1 bg-gray-300 top-1/2 w-[120px]`}></div>
                <div className={`bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative ${step.position === 'left' ? 'ml-16' : 'mr-16'} hover:shadow-xl transition-shadow duration-300 border border-gray-200`}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                  <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Step {step.number}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  const { token } = useContext(AuthContext);

  return (
    <section className="py-16 bg-gradient-to-r from-[#00A69C] to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready for Takeoff?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join millions of travelers enjoying seamless flight bookings
        </p>
        <div className="flex justify-center">
          {token ? (
            <Link
              to="/flights"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-[#00A69C] font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            >
              Search Flights
            </Link>
          ) : (
            <Link
              to="/signup"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-[#00A69C] font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
}

export default Home;