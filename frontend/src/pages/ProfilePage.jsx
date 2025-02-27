import React, { useState, useEffect } from "react";
import axios from "axios";
import {  useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaTicketAlt,
  FaCalendarCheck,
  FaClock,
  FaCamera,
  FaEdit,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import EditProfileModal from "../components/EditProfileModal";
import ImageSelectionModal from "../components/ImageSelectionModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);

  const [eventsParticipated, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);


  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/events/user/registered`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipatedEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch registered events");
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [token]);

  if (loading) {
     return (
       <div className="flex justify-center items-center h-screen">
         <ImSpinner8 className="animate-spin text-4xl text-teal-600" />
       </div>
     );
   }

  return (
    <div className="min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center">
                <FaUser className="text-6xl text-teal-600" />
              </div>
            )}
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full hover:bg-teal-700 transition-colors"
            >
              <FaCamera className="text-white text-lg" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="flex items-center text-lg mb-1">
              <FaEnvelope className="mr-2 text-teal-600" />
              {user.email}
            </p>
            <p className="flex items-center text-lg">
              <FaUserTag className="mr-2 text-teal-600" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-2 py-1 bg-teal-600 text-white rounded flex items-center text-sm hover:bg-teal-700"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Events Participated */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaTicketAlt className="mr-2 text-teal-600" />
          Events Participated
          <span className="ml-2 bg-teal-600 text-gray-100 px-3 py-1 rounded-full text-sm">
            {eventsParticipated?.length || 0}
          </span>
        </h2>
        {eventsParticipated?.length > 0 ? (
          <div className="space-y-4">
            {eventsParticipated.map((event) => (
              <div
                key={event._id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-teal-50 transition-colors border-l-4 border-teal-600"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm mt-1">{event.description}</p>
                <div className="flex items-center text-sm  mt-2">
                  <FaCalendarCheck className="mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <FaClock className="ml-4 mr-2" />
                  <span>{new Date(event.date).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm mt-1">{event.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="flex items-center justify-center">
              <FaTicketAlt className="mr-2 text-gray-400" />
              No events participated yet
            </p>
          </div>
        )}
      </div>


      <ImageSelectionModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        userId={user.id}
      />


      <EditProfileModal
        isOpen={isModalOpen}
        user={user}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};


export default ProfilePage;