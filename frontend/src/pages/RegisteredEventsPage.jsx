import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import MyEventCard from "../components/MyEventCard";
import { useSelector } from "react-redux";
import EventCard from "../components/EventCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisteredEventsPage = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token); 

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/events/user/registered`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegisteredEvents(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch registered events");
            } finally {
                setLoading(false);
            }
        };

        fetchRegisteredEvents();
    }, [token]);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Registered Events</h2>

            {error && <p className="text-red-500">Error: {error}</p>}

            {registeredEvents.length === 0 && !loading ? (
                <p className="text-gray-600 dark:text-gray-300">No registered events found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-900 rounded-sm p-4 shadow-md">
                                <Skeleton height={150} />
                                <div className="p-4">
                                    <Skeleton width="60%" />
                                    <Skeleton width="80%" />
                                    <Skeleton count={4} className="mt-2" width={"40%"} />
                                </div>
                            </div>
                        ))
                        : registeredEvents.map((event) => <EventCard key={event._id} event={event} />)}
                </div>
            )}
        </div>
    );
};

export default RegisteredEventsPage;
