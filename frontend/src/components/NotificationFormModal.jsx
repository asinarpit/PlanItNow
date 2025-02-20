import React from "react";

const NotificationFormModal = ({
    isOpen,
    onClose,
    onSendNotification,
    notificationTitle,
    notificationBody,
    setNotificationTitle,
    setNotificationBody,
    notificationType,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-1/2">
                <h3 className="text-xl font-bold mb-4">Send Notification</h3>
                <input
                    type="text"
                    placeholder="Notification Title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    className="border dark:border-gray-700 dark:bg-gray-800 rounded px-4 py-2 w-full mb-2"
                />
                <textarea
                    placeholder="Notification Body"
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    className="border dark:border-gray-700 dark:bg-gray-800 rounded px-4 py-2 w-full mb-4"
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="border  border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-gray-100 px-4 py-2 rounded text-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onSendNotification(notificationType);
                            onClose();
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-gray-100 px-4 py-2 rounded text-sm"
                    >
                        Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationFormModal;
