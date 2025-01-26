import React from "react";

const NotificationModal = ({
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
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
                <h3 className="text-xl font-bold mb-4">Send Notification</h3>
                <input
                    type="text"
                    placeholder="Notification Title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    className="border rounded px-4 py-2 w-full mb-2"
                />
                <textarea
                    placeholder="Notification Body"
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    className="border rounded px-4 py-2 w-full mb-4"
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onSendNotification(notificationType);
                            onClose();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
