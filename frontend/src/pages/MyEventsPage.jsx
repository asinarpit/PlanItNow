import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import MyEventCard from "../components/MyEventCard";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedEvents, setSortedEvents] = useState([]);
  const [sortType, setSortType] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/events/user/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [token]);

  useEffect(() => {
    if (events.length) {
      sortEvents(sortType);
    }
  }, [events, sortType]);

  const sortEvents = (type) => {
    const sorted = [...events].sort((a, b) => {
      if (type === "date") {
        return new Date(a.date) - new Date(b.date);
      } else if (type === "capacity") {
        return a.capacity - b.capacity;
      }
      return 0;
    });
    setSortedEvents(sorted);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Events</h2>

        <div className="flex gap-3 items-center">
          {/* Sort Dropdown */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Sort by</option>
            <option value="date">Date</option>
            <option value="capacity">Capacity</option>
          </select>

          <button
            onClick={() => navigate("new")}
            className="bg-teal-600 text-white px-4 py-2 rounded-sm hover:bg-teal-700 text-sm"
          >
            Add Event
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {events.length === 0 && !loading ? (
        <p className="text-gray-600 dark:text-gray-300">No events created yet.</p>
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
            : sortedEvents.map((event) => <MyEventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
