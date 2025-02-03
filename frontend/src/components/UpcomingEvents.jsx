import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton"; 


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/events/upcoming`);
        setUpcomingEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="mb-8 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? [...Array(3)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          : upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
