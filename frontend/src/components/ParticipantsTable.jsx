import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../features/event/eventsSlice";

const ParticipantsTable = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { events, loading } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const event = events.find((event) => event._id === eventId);

    if (loading) return <p>Loading participants...</p>;

    if (!event)
        return <p>No event found. Please return to the <a href="/events">events page</a>.</p>;

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go Back
            </button>
            <h2 className="text-2xl font-bold mb-4">Participants for {event.title}</h2>
            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">UID</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Name</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {event.participants.map((participant) => (
                        <tr key={participant._id} className="border-b">
                            <td className="py-3 px-6 text-sm text-gray-700">{participant._id || "N/A"}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{participant.name || "N/A"}</td>
                            <td className="py-3 px-6 text-sm text-gray-700">{participant.email || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ParticipantsTable;
