import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventCard = ({ event }) => {
  const { token, email } = useSelector((state) => state.auth);
  const [isRegistered, setIsRegistered] = useState(
    event.participants.some((participant) => participant.email === email)
  );
  const [loading, setLoading] = useState(false); 

  const handleToggleRegistration = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/events/${event._id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsRegistered((prevState) => !prevState); 
      toast.success(response.data.message); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while toggling registration"
      ); 
    } finally {
      setLoading(false); 
    } 
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={event.image || "https://placehold.co/400"}
        alt={event.title}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Category:</strong> {event.category}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Capacity:</strong> {event.capacity}
        </p>
        <button
          className={`mt-4 w-full ${
            isRegistered ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 px-4 rounded-lg transition`}
          onClick={handleToggleRegistration}
          disabled={loading}
        >
          {loading ? "Processing..." : isRegistered ? "Unregister" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
