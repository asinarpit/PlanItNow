import React from "react";
import { NavLink, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiX,
    FiHome,
    FiCalendar,
    FiInfo,
    FiLayout,
    FiUser,
    FiLogOut,
    FiArrowRight,
    FiMessageCircle,
} from "react-icons/fi";
import Portal from "./Portal";
import ThemeToggle from "./ThemeToggle";

const menuVariants = {
    hidden: {
        x: "100%",
        rotate: -5,
        opacity: 0,
    },
    visible: {
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 20,
        },
    },
    exit: {
        x: "100%",
        rotate: 5,
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

const linkVariants = {
    hover: {
        x: 10,
        scale: 1.02,
    },
    tap: { scale: 0.98 },
};

const MobileMenu = ({ isOpen, setIsOpen, user, handleLogout, dashboardLink }) => {
    const MobileLink = ({ to, text, icon, onClick }) => (
        <motion.div
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
            className="overflow-hidden"
        >
            <NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-xl ${isActive
                        ? "bg-teal-600 dark:bg-teal-900 text-gray-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <div className="flex items-center gap-3">
                    <span>{icon}</span>
                    <span className="font-medium">{text}</span>
                </div>
                <FiArrowRight />
            </NavLink>
        </motion.div>
    );

    return (
        <Portal>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 right-0 w-80 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 shadow-2xl p-6 border-l border-white/20"
            >
                <div className="flex justify-between items-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <span className="font-bold text-lg">PlanItNow</span>
                    </motion.div>

                    <div className="mx-4">
                        <ThemeToggle />
                    </div>
                    <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <FiX className="w-6 h-6" />
                    </motion.button>
                </div>

                {user?.id && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 mb-6 p-3 bg-teal-600 dark:bg-teal-900 rounded-xl"
                    >
                        <div className="w-12 h-12 overflow-hidden bg-teal-600 text-white rounded-full flex justify-center items-center">
                            {user.image ? <img src={user.image} className="w-full h-hull object-cover" /> : <FiUser className="w-5 h-5" />}

                        </div>
                        <div>
                            <p className="font-semibold text-gray-100">{user.name}</p>
                            <p className="text-sm text-gray-100">{user.role}</p>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <MobileLink
                        to="/"
                        text="Home"
                        icon={<FiHome />}
                        onClick={() => setIsOpen(false)}
                    />
                    <MobileLink
                        to="/events"
                        text="Events"
                        icon={<FiCalendar />}
                        onClick={() => setIsOpen(false)}
                    />
                    <MobileLink
                        to="/about"
                        text="About"
                        icon={<FiInfo />}
                        onClick={() => setIsOpen(false)}
                    />
                    {user?.id && (
                        <>
                        <MobileLink
                            to={dashboardLink}
                            text="Dashboard"
                            icon={<FiLayout />}
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileLink
                            to={"/discussions"}
                            text="Discussions"
                            icon={<FiMessageCircle/>}
                            onClick={() => setIsOpen(false)}
                        />
                        </>
                    )}
                </motion.div>

                <motion.div
                    className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex flex-col gap-3">
                        {user?.id ? (
                            <motion.button
                                whileHover={{ x: 5 }}
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                            >
                                <FiLogOut className="w-5 h-5" />
                                Logout
                            </motion.button>
                        ) : (
                            <>
                                <motion.div whileHover={{ x: 5 }}>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                                    >
                                        <FiUser className="w-5 h-5 text-teal-600" />
                                        Login
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ x: 5 }}>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                                    >
                                        <FiUser className="w-5 h-5 text-teal-600" />
                                        Sign Up
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>

                    <motion.div
                        className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>Made with ❤️ by Arpit Singh</p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </Portal>
    );
};

export default MobileMenu;