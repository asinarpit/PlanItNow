import React, { useEffect, useState } from "react";
import { FiMail, FiBell, FiSearch, FiChevronDown, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import NotificationPopover from "./NotificationPopover";
import { logout, removeDeviceToken } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";


const menuVariants = {
    open: { rotate: 90 },
    closed: { rotate: 0 },
};


const DashboardHeader = ({ onToggleSidebar, isSidebarOpen }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector(state => state.notifications);
    const [showPopover, setShowPopover] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();



    const unreadNotifications = notifications.filter((notif) => !notif.isRead);

    const handleLogout = async () => {
        try {
            await dispatch(removeDeviceToken()).unwrap();
            dispatch(logout());
            toast.success("Logged out successfully!");
            navigate("/login");
            setDropdownOpen(false);
        } catch (error) {
            toast.error("Failed to remove device token!");
            console.error("Error removing device token:", error);
            setDropdownOpen(false);
        }
    };

    return (
        <div className="flex items-center justify-between shadow-sm p-4 text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100 sticky top-0 z-50">
            <motion.button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                variants={menuVariants}
                animate={isSidebarOpen ? "open" : "closed"}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <FiMenu className="w-5 h-5" />
            </motion.button>
            {/* Search */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-sm px-2 dark:bg-gray-800 border dark:border-gray-700">
                <input
                    type="text"
                    placeholder="Search Here..."
                    className="bg-transparent p-2 text-sm focus:outline-none"
                />
                <button>
                    <FiSearch className="hover:text-teal-600" size={20} />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Icons */}
                <div className="flex items-center gap-3">
                    {/* <FiMail className="w-5 h-5 cursor-pointer hover:text-teal-600" /> */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowPopover(true)}
                        onMouseLeave={() => setShowPopover(false)}
                    >
                        <FiBell className="w-5 h-5 cursor-pointer hover:text-teal-600" />
                        {/* Notification Badge */}
                        {unreadNotifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[0.65rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {unreadNotifications.length}
                            </span>
                        )}
                        {showPopover && <NotificationPopover notifications={unreadNotifications} loading={loading} onClose={setShowPopover} />}
                    </div>
                </div>

                {/* Dark Mode */}
                <ThemeToggle />

                {/* Profile */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <img
                            src={user.image || "https://placehold.co/50"}
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="hidden lg:block">{user.name}</span>
                        <FiChevronDown
                            className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                }`}
                        />

                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
                            <ul className="py-2">
                                <li onClick={() => { navigate(`/dashboard/${user.role}/my-profile`); setDropdownOpen(false); }
                                } className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Profile</span>
                                </li>
                                {/* <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <FiMessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Chat</span>
                                </li> */}
                                {/* <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <FiMail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Inbox</span>
                                </li> */}
                                {/* <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <FiUserPlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    <span>Add Account</span>
                                </li> */}
                                <li
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-600 dark:text-red-400"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
