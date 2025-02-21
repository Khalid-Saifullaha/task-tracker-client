import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import lottieBanner from "../../assets/lottie-banner.json";
import { FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className=" min-h-screen flex items-center justify-center bg-white">
      <div className="w-4/5 mx-auto text-center py-10">
        {/* Animated BIG Heading with White Shadow */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 md:mt-6 mt-0"
          style={{
            textShadow: "2px 2px 6px #ffffff",
          }}
          initial={{ opacity: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          whileHover={{
            x: [-3, 3, -3, 3, 0],
            transition: { duration: 0.3, repeat: 3 },
          }}
        >
          Welcome to Task Tracker
        </motion.h1>

        {/* Animated Lottie Animation */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Lottie
            animationData={lottieBanner}
            className="w-4/5 md:w-3/5 lg:w-2/5"
          />
        </motion.div>

        {/* Animated Description */}
        <motion.p
          className="mt-4 text-base md:text-lg lg:text-xl text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Stay organized and productive by tracking your tasks efficiently.
          Plan, manage, and complete your daily activities with ease!
        </motion.p>

        {/* Animated "Set Tasks" Button */}
        <motion.button
          className="btn bg-gray-800 mt-10 text-white rounded-lg shadow-lg text-lg font-semibold hover:bg-gray-700 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          onClick={() => navigate("/tasks")}
        >
          <FaTasks /> Set Tasks
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
