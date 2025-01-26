import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/events/featured`);
        setFeaturedEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured events:", error);
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? [...Array(3)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          : featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;
