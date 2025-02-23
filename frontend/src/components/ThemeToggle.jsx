import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {theme === "light" ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggle;
