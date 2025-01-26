import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents, deleteEvent, updateEventStatus, toggleFeatureEvent } from "../features/event/eventsSlice";
import EventFormModal from "./EventFormModal";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

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

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Events</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Event
          </button>
        </div>
        <div className="max-w-[1250px] overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <span>Date</span>
                  <button
                    onClick={handleSortByDate}
                    className="text-gray-600 hover:text-black"
                  >
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Participants</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Capacity</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Featured</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event._id} className="border-b">
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
                  <td className="py-3 px-6 text-sm text-gray-700">{event.title}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{new Date(event.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{event.description}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{event.participants.length}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    <select
                      value={event.status}
                      onChange={(e) => handleUpdateStatus(event._id, e.target.value)}
                      className="bg-gray-200 p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">{event.location}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{event.category}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{event.capacity}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    <select
                      value={event.isFeatured ? "featured" : "unfeatured"}
                      onChange={(e) => handleToggleFeatured(event._id, e.target.value === "featured")}
                      className="bg-gray-200 p-1 rounded"
                    >
                      <option value="unfeatured">Unfeature</option>
                      <option value="featured">Feature</option>
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
              ))}
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
