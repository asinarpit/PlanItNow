import React, { useState, useRef, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMore } from "react-icons/ai";
import { MdOutlineFeedback } from "react-icons/md";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../features/event/eventsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ImSpinner8 } from "react-icons/im";

const MyEventCard = ({ event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    navigate(`edit/${event._id}`);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteEvent(event._id)).unwrap();
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the event.");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const handleViewFeedback = () => {
    navigate(`feedback/${event._id}`);
    setIsOpen(false);
  };

  const handleViewParticipants = () => {
    navigate(`participants/${event._id}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          src={event.image || "https://placehold.co/400"}
          alt={event.title}
        />
        <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
            {event.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="mr-2 text-teal-600" />
              <span>{formattedDate}</span>
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
        </div>

        <div className="absolute bottom-5 right-5">
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <AiOutlineMore className="text-xl" />
            </button>

            {isOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden z-50 border dark:border-gray-600">
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <AiOutlineEdit className="mr-3 text-lg" />
                  Edit Event
                </button>
                <button
                  onClick={handleViewParticipants}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <FaUsers className="mr-3 text-lg" />
                  View Participants
                </button>
                <button
                  onClick={handleViewFeedback}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <MdOutlineFeedback className="mr-3 text-lg" />
                  View Feedback
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                >
                  {isDeleting ? (
                    <ImSpinner8 className="mr-3 animate-spin" />
                  ) : (
                    <AiOutlineDelete className="mr-3 text-lg" />
                  )}
                  Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;