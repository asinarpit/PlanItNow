import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("unread"); // "unread" or "read"

    const { token } = useSelector((state) => state.auth);

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

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/${notificationId}/mark-read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotifications((notifications) =>
                notifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error.response?.data?.message || error.message);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/mark-all-read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotifications((notifications) =>
                notifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error("Error marking all notifications as read:", error.response?.data?.message || error.message);
        }
    };

    const filteredNotifications =
        activeTab === "unread"
            ? notifications.filter((notification) => !notification.isRead)
            : notifications.filter((notification) => notification.isRead);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Your Notifications</h1>

            <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab("unread")}
                    className={`px-4 py-2 ${
                        activeTab === "unread"
                            ? "border-b-2 border-teal-600 font-semibold"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    Unread
                </button>
                <button
                    onClick={() => setActiveTab("read")}
                    className={`px-4 py-2 ${
                        activeTab === "read"
                            ? "border-b-2 border-teal-600 font-semibold"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    Read
                </button>
            </div>

            {activeTab === "unread" && (
                <div className="flex justify-end mb-4">
                    {filteredNotifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="border border-teal-600 text-teal-600 font-semibold text-xs py-2 px-4 rounded-sm hover:bg-teal-600 hover:text-gray-100 transition"
                        >
                            Mark All as Read
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className="text-center">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
                <div className="text-center">
                    {activeTab === "unread"
                        ? "No unread notifications."
                        : "No read notifications."}
                </div>
            ) : (
                <ul className="space-y-4">
                    {filteredNotifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`p-4 border dark:border-gray-700 rounded-lg ${
                                notification.isRead
                                    ? "bg-gray-200 dark:bg-gray-950"
                                    : "bg-white"
                            } dark:bg-gray-900 shadow-md`}
                        >
                            <h2 className="font-semibold text-lg">{notification.title}</h2>
                            <p className="mt-2">{notification.body}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="bg-teal-600 text-white text-sm py-1 px-3 rounded-sm hover:bg-teal-700 transition"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
