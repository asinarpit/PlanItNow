import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents, deleteEvent, updateEventStatus, toggleFeatureEvent } from "../features/event/eventsSlice";
import EventFormModal from "./EventFormModal";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

const EventManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the event.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateEventStatus({ id, status })).unwrap();
      toast.success(`Event status updated to "${status}".`);
    } catch (error) {
      toast.error("Failed to update event status.");
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      await dispatch(toggleFeatureEvent({ id, isFeatured })).unwrap();
      toast.success(`Event ${isFeatured ? "featured" : "unfeatured"} successfully!`);
    } catch (error) {
      toast.error("Failed to update featured status.");
    }
  };

  const handleViewFeedback = (eventId) => {
    navigate(`feedback/${eventId}`);
  };

  const handleViewParticipants = (eventId) => {
    navigate(`participants/${eventId}`);
  };

  const handleSortByDate = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };



  const sortedEvents = [...events].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });


  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Events</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
          >
            Add Event
          </button>
        </div>
        <div className="max-w-[1200px] overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto dark:bg-gray-900">
            <thead className="bg-teal-600 dark:bg-gray-900 text-gray-100 border-b dark:border-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium">Image</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Title</th>
                <th className="py-3 px-6 text-left text-sm font-medium flex items-center space-x-2">
                  <span>Date</span>
                  <button
                    onClick={handleSortByDate}
                    className=" hover:text-black text-xs"
                  >
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium">Description</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Participants</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Location</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Category</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Capacity</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Featured</th>
                <th className="py-3 px-6 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="p-3">
                        <Skeleton height={50} width={50} circle />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={150} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={100} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={200} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={50} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={100} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={120} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={80} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={60} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={80} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={100} />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                sortedEvents.map((event) => (
                  <tr key={event._id} className="border-b dark:border-gray-700">
                    <td className="p-3">
                      {event.image ? (
                        <img
                          loading="lazy"
                          src={event.image || "https://placehold.co/400"}
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm">{event.title}</td>
                    <td className="py-3 px-6 text-sm">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-6 text-sm">{event.description}</td>
                    <td className="py-3 px-6 text-sm">{event.participants.length}</td>
                    <td className="py-3 px-6 text-sm">
                      <select
                        value={event.status}
                        onChange={(e) => handleUpdateStatus(event._id, e.target.value)}
                        className={`p-1 rounded
              ${event.status === "pending" ? "bg-yellow-600/10 text-yellow-600" : ""}
              ${event.status === "approved" ? "bg-green-600/10 text-green-600" : ""}
              ${event.status === "rejected" ? "bg-red-600/10 text-red-600" : ""}`}
                      >
                        <option className="bg-white text-gray-100 dark:bg-gray-800" value="pending">Pending</option>
                        <option className="bg-white text-gray-100  dark:bg-gray-800" value="approved">Approved</option>
                        <option className="bg-white text-gray-100  dark:bg-gray-800" value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-sm">{event.location}</td>
                    <td className="py-3 px-6 text-sm">{event.category}</td>
                    <td className="py-3 px-6 text-sm">{event.capacity}</td>
                    <td className="py-3 px-6 text-sm">
                      <select
                        value={event.isFeatured ? "featured" : "unfeatured"}
                        onChange={(e) => handleToggleFeatured(event._id, e.target.value === "featured")}
                        className={`p-1 rounded 
                          ${event.isFeatured ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"}`}
                      >
                        <option className="bg-white text-gray-100 dark:bg-gray-800" value="unfeatured">Unfeature</option>
                        <option className="bg-white text-gray-100 dark:bg-gray-800" value="featured">Feature</option>
                      </select>
                    </td>
                    <td className="p-3 flex space-x-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewFeedback(event._id)}
                        className="text-green-500 hover:underline text-sm"
                      >
                        View Feedback
                      </button>
                      <button
                        onClick={() => handleViewParticipants(event._id)}
                        className="text-purple-500 hover:underline text-sm"
                      >
                        View Participants
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>


      </div>

      {isModalOpen && (
        <EventFormModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          currentEvent={currentEvent}
        />
      )}
    </div>
  );
};

export default EventManagement;
