import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ParticipantsPage = () => {
    const { eventId } = useParams();
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationBody, setNotificationBody] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEventData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event data");
                setFetchError(true);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, token]);

    useEffect(() => {
        if (eventData) {
            const defaultTitle = `New Notification for ${eventData.title}`;
            const defaultBody = `We have important updates for you regarding the event: ${eventData.title}. Please check your event details for more information.`;
            setNotificationTitle(defaultTitle);
            setNotificationBody(defaultBody);
        }
    }, [eventData]);

    const handleSendNotification = async () => {
        try {
            if (!eventData?.participants?.length) {
                toast.error("No participants found for this event");
                return;
            }

            const deviceTokens = eventData.participants
                .map((user) => user.deviceToken)
                .filter(Boolean);

            if (deviceTokens.length === 0) {
                toast.error("No valid device tokens found.");
                return;
            }

            await axios.post(
                `${BASE_URL}/notifications/send-notification`,
                {
                    title: notificationTitle,
                    body: notificationBody,
                    deviceTokens,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Notification sent successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Failed to send notification.");
        }
    };

    if (fetchError) {
        return <p>Error loading event. Please try again later.</p>;
    }

    if (!loading && !eventData) {
        return <p>No event found. Please return to the <a href="/events">events page</a>.</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm border border-teal-600 text-teal-600 hover:text-white rounded-sm hover:bg-teal-600"
                >
                    Go Back
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-sm bg-teal-600 text-white rounded-sm hover:bg-teal-700"
                    disabled={!eventData?.participants?.length}
                >
                    Notify All
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">
                {loading ? <Skeleton width={300} /> : `Participants for ${eventData?.title}`}
            </h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto dark:bg-gray-900">
                    <thead className="bg-teal-600 dark:bg-gray-900 border-b dark:border-gray-700 text-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left text-sm font-medium">UID</th>
                            <th className="py-3 px-6 text-left text-sm font-medium">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(10)].map((_, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                    <td className="p-3"><Skeleton width={150} /></td>
                                    <td className="py-3 px-6 text-sm"><Skeleton width={150} /></td>
                                    <td className="py-3 px-6 text-sm"><Skeleton width={100} /></td>
                                </tr>
                            ))
                        ) : eventData?.participants?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 text-center">
                                    No Participants found.
                                </td>
                            </tr>
                        ) : (
                            eventData?.participants?.map((participant) => (
                                <tr key={participant._id} className="border-b dark:border-gray-700">
                                    <td className="py-3 px-6 text-sm">{participant._id || "N/A"}</td>
                                    <td className="py-3 px-6 text-sm">{participant.name || "N/A"}</td>
                                    <td className="py-3 px-6 text-sm">{participant.email || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Notification Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            Send Notification to All Participants
                        </h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={notificationTitle}
                            onChange={(e) => setNotificationTitle(e.target.value)}
                            className="w-full mb-3 p-2 border rounded-sm dark:bg-gray-900 dark:border-gray-700"
                        />
                        <textarea
                            placeholder="Message"
                            value={notificationBody}
                            onChange={(e) => setNotificationBody(e.target.value)}
                            className="w-full mb-3 p-2 border rounded-sm dark:bg-gray-900 dark:border-gray-700"
                            rows="3"
                        />
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 border border-teal-600 text-teal-600 rounded-sm hover:bg-teal-600 hover:text-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendNotification}
                                className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsPage;