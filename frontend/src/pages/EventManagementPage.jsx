import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents, deleteEvent, updateEventStatus, toggleFeatureEvent } from "../features/event/eventsSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { RxCaretSort } from "react-icons/rx";
import { FaEdit, FaTrash, FaCommentDots, FaUsers, FaInfoCircle } from "react-icons/fa";

const EventManagementPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: "date", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading } = useSelector((state) => state.events);


  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleEdit = (eventId) => {
    navigate(`edit/${eventId}`);
  };

  const handleAddEvent = () => {
    navigate(`new`);
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

  const handleViewDetails = (eventId) => {
    navigate(`${eventId}`); // Adjust the route as per your setup
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      order: prevConfig.key === key && prevConfig.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Update search query
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    const searchText = searchQuery.trim().toLowerCase();
    if (!searchText) return true;

    return (
      event.title?.toLowerCase()?.includes(searchText) ||
      event.shortDescription?.toLowerCase()?.includes(searchText) ||
      event.location?.toLowerCase()?.includes(searchText) ||
      event.category?.toLowerCase()?.includes(searchText) ||
      event.createdBy?.name?.toLowerCase()?.includes(searchText)
    );
  });

  // Sort filtered events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const order = sortConfig.order === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Events</h2>
        <div className="flex justify-between items-center mb-4">
          {/* Search Box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search events by title, description, location, category, or creator..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border dark:border-gray-700 rounded px-4 py-2 w-[450px] bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAddEvent}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
          >
            Add Event
          </button>
        </div>



        <div className="max-w-[1200px] overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto dark:bg-gray-900">
            <thead className="bg-teal-600 dark:bg-gray-900 text-gray-100 border-b dark:border-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium">Image</th>
                {[
                  { key: "title", label: "Title" },
                  { key: "date", label: "Date" },
                  { key: "shortDescription", label: "Short Description" },
                  { key: "createdBy.name", label: "Creator" },
                  { key: "participants.length", label: "Participants" },
                  { key: "status", label: "Status" },
                  { key: "location", label: "Location" },
                  { key: "eventType", label: "Event Type" },
                  { key: "department", label: "Department" },
                  { key: "capacity", label: "Capacity" },
                  { key: "isFeatured", label: "Featured" },
                ].map(({ key, label }) => (
                  <th key={key} className="py-3 px-6 text-sm font-medium cursor-pointer  hover:bg-teal-700" onClick={() => handleSort(key)}>
                    <p className="flex items-center gap-2 justify-between">
                      {label}
                      <RxCaretSort size={20} />
                    </p>
                  </th>
                ))}
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
                      <td className="py-3 px-6 text-sm">
                        <div className="flex space-x-4">
                          <Skeleton width={20} />
                          <Skeleton width={20} />
                          <Skeleton width={20} />
                          <Skeleton width={20} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-4 text-center">
                    No events found.
                  </td>
                </tr>
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
                    <td className="relative py-3 px-6 text-sm max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible hover:h-auto cursor-pointer">
                      {event.shortDescription}
                    </td>
                    <td className="py-3 px-6 text-sm">{event.createdBy.name}</td>
                    <td className="py-3 px-6 text-sm">{event.participants.length}</td>
                    <td className="py-3 px-6 text-sm">
                      <select
                        value={event.status}
                        onChange={(e) => handleUpdateStatus(event._id, e.target.value)}
                        className={`p-1 rounded cursor-pointer
              ${event.status === "pending" ? "bg-yellow-600/10 text-yellow-600" : ""}
              ${event.status === "approved" ? "bg-green-600/10 text-green-600" : ""}
              ${event.status === "rejected" ? "bg-red-600/10 text-red-600" : ""}
              ${event.status === "cancelled" ? "bg-orange-600/10 text-orange-600" : ""}
              
              `}
                      >
                        <option className="bg-white dark:bg-gray-800 cursor-pointer" value="pending">Pending</option>
                        <option className="bg-white  dark:bg-gray-800 cursor-pointer" value="approved">Approved</option>
                        <option className="bg-white  dark:bg-gray-800 cursor-pointer" value="rejected">Rejected</option>
                        <option className="bg-white  dark:bg-gray-800 cursor-pointer" value="cancelled">Cancelled</option>

                      </select>
                    </td>
                    <td className="py-3 px-6 text-sm">{event.location}</td>
                    <td className="py-3 px-6 text-sm">{event.eventType}</td>
                    <td className="py-3 px-6 text-sm">{event.department}</td>
                    <td className="py-3 px-6 text-sm">{event.capacity}</td>
                    <td className="py-3 px-6 text-sm">
                      <select
                        value={event.isFeatured ? "featured" : "unfeatured"}
                        onChange={(e) => handleToggleFeatured(event._id, e.target.value === "featured")}
                        className={`p-1 rounded cursor-pointer 
                          ${event.isFeatured ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"}`}
                      >
                        <option className="bg-white dark:bg-gray-800 cursor-pointer" value="unfeatured">Unfeature</option>
                        <option className="bg-white dark:bg-gray-800 cursor-pointer" value="featured">Feature</option>
                      </select>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(event._id)}
                          className="relative z-10 text-blue-500 hover:underline text-sm flex items-center group"
                        >
                          <FaEdit />
                          <span className="absolute top-full px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="relative z-10 text-red-500 hover:underline text-sm flex items-center group"
                        >
                          <FaTrash />
                          <span className="absolute top-full px-2 py-1 text-xs bg-gray-800  rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Delete
                          </span>
                        </button>
                        <button
                          onClick={() => handleViewFeedback(event._id)}
                          className="relative z-10 text-green-500 hover:underline text-sm flex items-center group"
                        >
                          <FaCommentDots />
                          <span className="absolute top-full px-2 py-1 text-xs bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Feedbacks
                          </span>
                        </button>
                        <button
                          onClick={() => handleViewParticipants(event._id)}
                          className="relative z-10 text-purple-500 hover:underline text-sm flex items-center group"
                        >
                          <FaUsers />
                          <span className="absolute top-full px-2 py-1 text-xs bg-gray-800  rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Participants
                          </span>
                        </button>
                        <button
                          onClick={() => handleViewDetails(event._id)}
                          className="relative z-10 text-gray-500 hover:underline text-sm flex items-center group"
                        >
                          <FaInfoCircle />
                          <span className="absolute top-full px-2 py-1 text-xs bg-gray-800 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            View Details
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManagementPage;