import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from "date-fns";

const NotificationPopover = ({ notifications, loading, onClose }) => {
    const navigate = useNavigate();
    const { role } = useSelector(state => state.auth.user);

    const handleButtonClick = () =>{
        navigate(`/dashboard/${role}/notifications`);
        onClose(false);
    }

    return (
        <div className="absolute  -right-24 lg:right-0 z-50  mt-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-teal-600 text-white">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <span className="text-xs">{notifications.length} new</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <>
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Skeleton circle width={32} height={32} />
                                </div>
                                <div className="flex-1">
                                    <Skeleton width="80%" height={12} />
                                    <Skeleton width="60%" height={10} />
                                </div>
                            </div>
                        ))}
                    </>
                ) : notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
                                <img src={notification.sender?.image || "https://cdn-icons-png.flaticon.com/128/11820/11820201.png"} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}

                                    </span>

                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {notification.body}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 py-4">
                        No notifications found.
                    </p>
                )}
            </div>
            <button
                onClick={handleButtonClick}
                className="w-full py-2 text-center text-sm font-medium text-teal-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
                See All Notifications
            </button>
        </div>
    );
};

export default NotificationPopover;
