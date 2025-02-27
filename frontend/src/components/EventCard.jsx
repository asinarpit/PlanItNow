import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventCard = ({ event }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [isRegistered, setIsRegistered] = useState(
    event.participants.some((participant) => participant._id === user.id)
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggleRegistration = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/events/${event._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRegistered((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  // Date formatting
  const startDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  
  const formatDate = (date) => 
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const dateDisplay = endDate && startDate.getTime() !== endDate.getTime() 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          src={event.image || "https://placehold.co/400"}
          alt={event.title}
          onClick={handleCardClick}
        />
        <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          {event.eventType}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <h3
            className="text-xl font-bold text-gray-800 dark:text-white mb-2 cursor-pointer hover:underline"
            onClick={handleCardClick}
          >
            {event.title}
          </h3>
          {event.department && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {event.department}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {event.shortDescription}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaCalendarAlt className="mr-2 text-teal-600" />
            <span>{dateDisplay}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-teal-600" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaUsers className="mr-2 text-teal-600" />
            <span>{event.participants?.length || 0} / {event.capacity} attendees</span>
          </div>
        </div>

        {event.registrationRequired && (
          <div className="mt-auto pt-4">
            <button
              onClick={handleToggleRegistration}
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium transition-all ${
                isRegistered
                  ? "bg-transparent border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              } ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <ImSpinner8 className="animate-spin mr-2" />
              ) : isRegistered ? (
                "Unregister"
              ) : (
                "Register Now"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
