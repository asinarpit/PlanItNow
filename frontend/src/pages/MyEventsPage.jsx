import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserEvents } from "../features/event/eventsSlice";
import MyEventCard from "../components/MyEventCard";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";


const MyEventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const [sortedEvents, setSortedEvents] = useState([]);
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    dispatch(fetchUserEvents());
  }, [dispatch]);

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
            ?
            Array.from({ length: events.length }).map((_, index) => (
              <div className="bg-white dark:bg-gray-900 rounded-sm p-4 shadow-md">
                <Skeleton height={150} />
                <div className="p-4">
                  <Skeleton width="60%" />
                  <Skeleton width="80%" />
                  <Skeleton count={4} className="mt-2" width={"40%"} />

                </div>
              </div>
            ))
            : sortedEvents.map((event) => (
              <MyEventCard key={event._id} event={event} />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
