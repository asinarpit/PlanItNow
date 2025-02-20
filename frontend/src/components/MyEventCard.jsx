import React, { useState, useRef, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMore } from "react-icons/ai";
import { MdOutlineFeedback } from "react-icons/md";

import { FaUsers } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../features/event/eventsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const MyEventCard = ({ event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = () => {
    navigate(`edit/${event._id}`);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event._id)).unwrap();
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the event.");
    }
    setIsOpen(false);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-sm shadow-md overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={event.image || "https://placehold.co/400"}
        alt={event.title}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p className="text-sm mt-2">{event.description}</p>
        <p className="text-sm mt-2">
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="text-sm mt-2">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm mt-2">
          <strong>Category:</strong> {event.category}
        </p>
        <p className="text-sm mt-2">
          <strong>Capacity:</strong> {event.capacity}
        </p>

        <div className="flex justify-end mt-3 relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <AiOutlineMore className="text-xl" />
          </button>

          {isOpen && (
            <div className="absolute right-0 bottom-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50 border dark:border-gray-700">
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <AiOutlineEdit className="mr-2 text-lg" />
                Edit
              </button>
              <button
                onClick={handleViewParticipants}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaUsers className="mr-2 text-lg" />
                Participants
              </button>
              <button
                onClick={handleViewFeedback}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MdOutlineFeedback className="mr-2 text-lg" />
                Feedbacks
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
              >
                <AiOutlineDelete className="mr-2 text-lg" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;
