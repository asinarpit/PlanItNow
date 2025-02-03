import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserEvents } from "../features/event/eventsSlice"; 
import EventCard from "./EventCard";

const MyEvents = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { events, loading, error } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchUserEvents());
    }, [dispatch]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Events</h2>

            {loading && <p className="text-gray-600 dark:text-gray-300">Loading events...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {events.length === 0 && !loading ? (
                <p className="text-gray-600 dark:text-gray-300">No events created yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
