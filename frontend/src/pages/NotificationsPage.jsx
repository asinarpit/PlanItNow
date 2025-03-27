import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../features/notification/notificationSlice";
import Skeleton from "react-loading-skeleton";


const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector((state) => state.notifications);
    const { token } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = React.useState("unread");

    useEffect(() => {
        if (token) {
            dispatch(fetchNotifications(token));
        }
    }, [dispatch, token]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markNotificationAsRead({ notificationId, token }));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead(token));
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
                    className={`px-4 py-2 ${activeTab === "unread" ? "border-b-2 border-teal-600 font-semibold" : "text-gray-500 dark:text-gray-400"}`}
                >
                    Unread
                </button>
                <button
                    onClick={() => setActiveTab("read")}
                    className={`px-4 py-2 ${activeTab === "read" ? "border-b-2 border-teal-600 font-semibold" : "text-gray-500 dark:text-gray-400"}`}
                >
                    Read
                </button>
            </div>

            {activeTab === "unread" && (
                <div className="flex justify-end mb-4">
                    {filteredNotifications.length > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="border border-teal-600 text-teal-600 font-semibold text-xs py-2 px-4 rounded-sm hover:bg-teal-600 hover:text-gray-100 transition"
                        >
                            Mark All as Read
                        </button>
                    )}
                </div>
            )}


            {loading ? (
                <>
                    {[...Array(5)].map((_, index) => (
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-md mb-4 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton circle width={32} height={32} />
                                <Skeleton width={120} />
                            </div>
                            <Skeleton width={"30%"} />
                            <Skeleton width={"10%"} />
                        </div>
                    ))}
                </>
            ) : filteredNotifications.length === 0 ? (
                <div className="text-center">
                    {activeTab === "unread" ? "No unread notifications." : "No read notifications."}
                </div>
            ) : (
                <ul className="space-y-4">
                    {filteredNotifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`p-4 border dark:border-gray-700 rounded-lg ${notification.isRead ? "bg-gray-200 dark:bg-gray-950" : "bg-white"
                                } dark:bg-gray-900 shadow-sm`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={notification.sender?.image || "https://cdn-icons-png.flaticon.com/128/11820/11820201.png"}
                                    alt={notification.sender?.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {notification.sender?.name}
                                </p>
                            </div>
                            <h2 className="font-semibold text-lg">{notification.title}</h2>
                            <p className="mt-2">{notification.body}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
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

export default NotificationsPage;
