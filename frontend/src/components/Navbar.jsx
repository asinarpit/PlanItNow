import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout, removeDeviceToken } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiMessageCircle } from "react-icons/fi";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { path: "/", name: "Home" },
  { path: "/events", name: "Events" },
  { path: "/about", name: "About" },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(removeDeviceToken()).unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
      setIsOpen(false);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const dashboardLink = user
    ? user.role === "student"
      ? "/dashboard/student"
      : user.role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/faculty"
    : null;

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center shadow-md">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="text-xl font-semibold">
          Plan<span className="font-bold text-teal-600">It</span>Now
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="relative py-1 group"
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className={`relative z-10 ${isActive
                        ? "text-teal-600 font-semibold"
                        : "text-gray-600 dark:text-gray-300 hover:text-teal-600"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          {user?.id && (
            <NavLink
              to={dashboardLink}
              className="relative py-1 group"
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    className={`relative z-10 ${isActive
                        ? "text-teal-600 font-semibold"
                        : "text-gray-600 dark:text-gray-300 hover:text-teal-600"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dashboard
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4 ml-4">
          {
            user?.id && (
              <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/discussions"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 relative"
              >
                <FiMessageCircle className="w-6 h-6" />
              </Link>
            </motion.div>
            )
          }
          <ThemeToggle />
          
          {user?.id ? (
            <motion.button
              onClick={handleLogout}
              className="bg-red-500 dark:bg-red-700 px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-800 text-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-teal-600 font-semibold text-gray-100 px-4 py-2 rounded-md hover:bg-teal-700"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="border text-teal-600 font-semibold border-teal-600 px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-full bg-teal-600 text-white"
        aria-label="Open menu"
      >
        <FiMenu className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            user={user}
            handleLogout={handleLogout}
            dashboardLink={dashboardLink}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;