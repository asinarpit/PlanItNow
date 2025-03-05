import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaLink, FaRegCalendarCheck, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/events/${eventId}`);
        setEvent(response.data);
        setIsRegistered(response.data.participants?.some(participant => participant._id === user.id));
      } catch (error) {
        console.error("Error fetching event:", error);
        setIsError(true);
        toast.error("Failed to load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  const handleToggleRegistration = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/events/${eventId}/register`,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner8 className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Failed to load event details.</p>
      </div>
    );
  }

  const eventDate = new Date(event.date).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endDate = new Date(event.endDate).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl hover:shadow-xl transition-shadow duration-300">
          <img
            src={event.image || "https://placehold.co/800x500"}
            alt={event.title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="bg-teal-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              {event.eventType}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-8">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h1 className="text-4xl font-bold text-gray-900  mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-4">
              {event.shortDescription}
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Event Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FaCalendarAlt className="flex-shrink-0 mr-4 mt-1 text-teal-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Date & Time</h3>
                <p className="text-gray-600 dark:text-gray-400">{eventDate}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">to {endDate}</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FaMapMarkerAlt className="flex-shrink-0 mr-4 mt-1 text-teal-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
                {event.virtualEventLink && (
                  <a href={event.virtualEventLink} className="text-teal-600 hover:underline text-sm inline-flex items-center mt-1">
                    <FaLink className="mr-1 text-sm" /> Virtual Access
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <FaUsers className="flex-shrink-0 mr-4 mt-1 text-teal-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Attendance</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{event.participants?.length || 0}</span> of {event.capacity} registered
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${(event.participants?.length / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {event.registrationFee > 0 && (
              <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <FaMoneyBillWave className="flex-shrink-0 mr-4 mt-1 text-teal-600 text-xl" />
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Registration Fee</h3>
                  <p className="text-gray-600 dark:text-gray-400">${event.registrationFee}</p>
                  {event.paymentLink && (
                    <a href={event.paymentLink} className="mt-2 inline-flex items-center px-3 py-1.5 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-100 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors">
                      <FaLink className="mr-2 text-sm" /> Complete Payment
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Registration CTA */}
          <button
            onClick={handleToggleRegistration}
            disabled={loading}
            className={`w-full px-8 py-4 rounded-xl font-semibold transition-all 
                ${isRegistered
                ? "bg-white dark:bg-gray-800 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-700"
                : "bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg"
              } ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <ImSpinner8 className="animate-spin mx-auto" />
            ) : isRegistered ? (
              <span className="inline-flex items-center">
                <FaRegCalendarCheck className="mr-2" /> Registered ✓
              </span>
            ) : (
              "Register Now"
            )}
          </button>

          {/* Social Links */}
          {event.socialMedia && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">FOLLOW EVENT UPDATES</h3>
              <div className="flex space-x-4">
                {event.socialMedia.facebook && (
                  <a href={event.socialMedia.facebook} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors">
                    <FaFacebook className="text-gray-600 dark:text-gray-300 text-xl" />
                  </a>
                )}
                {event.socialMedia.instagram && (
                  <a href={event.socialMedia.instagram} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors">
                    <FaInstagram className="text-gray-600 dark:text-gray-300 text-xl" />
                  </a>
                )}
                {event.socialMedia.twitter && (
                  <a href={event.socialMedia.twitter} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors">
                    <FaTwitter className="text-gray-600 dark:text-gray-300 text-xl" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      {event.gallery?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Event Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.gallery.map((image, index) => (
              <div key={index} className="relative group aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={image}
                  alt={`Event gallery ${index + 1}`}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Agenda Section */}
      {event.agenda?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Event Agenda</h2>
          <div className="space-y-4">
            {event.agenda.map((item, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-teal-600/30 group">
                <div className="absolute w-4 h-4 bg-teal-600 rounded-full -left-[9px] top-0 ring-4 ring-white dark:ring-gray-900" />
                <div className="p-6 ml-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-teal-600 font-medium mb-2 md:mb-0">
                      {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  {item.speaker && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Speaker: <span className="font-medium text-teal-600">{item.speaker}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventDetailPage;