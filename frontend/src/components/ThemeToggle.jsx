import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const iconVariants = {
    initial: { opacity: 0, rotate: -45 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 45 }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-full relative overflow-hidden"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <div className="w-5 h-5 relative flex justify-center items-center">
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.span
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <FiSun className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <FiMoon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;