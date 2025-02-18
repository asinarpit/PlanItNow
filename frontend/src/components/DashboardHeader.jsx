import React, { useEffect, useState } from "react";
import { FiMail, FiBell, FiSearch, FiChevronDown, FiLogOut, FiUserPlus, FiMessageCircle, FiUser } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import NotificationPopover from "./NotificationPopover";
import { logout } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardHeader = () => {
    const { user, token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [token]);

    const unreadNotifications = notifications.filter((notif) => !notif.isRead);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
    };

    return (
        <div className="flex items-center justify-between p-4 text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100">
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
                    <FiMail className="w-5 h-5 cursor-pointer hover:text-teal-600" />
                    <div
                        className="relative"
                        onMouseEnter={() => setShowPopover(true)}
                        onMouseLeave={() => setShowPopover(false)}
                    >
                        <FiBell className="w-5 h-5 cursor-pointer hover:text-teal-600" />
                        {/* Notification Badge */}
                        {unreadNotifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
                            src="https://placehold.co/50"
                            alt="profile"
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="hidden lg:block">{user}</span>
                        <FiChevronDown
                            className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                }`}
                        />

                    </div>

                    {/* Dropdown Menu */}
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
                            <ul className="py-2">
                                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
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
