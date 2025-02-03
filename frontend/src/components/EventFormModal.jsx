import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent } from "../features/event/eventsSlice";
import { toast } from "react-hot-toast";

const EventFormModal = ({ isOpen, setIsOpen, currentEvent }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    capacity: "",
    status: "pending",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      setFormData({
        title: currentEvent.title,
        description: currentEvent.description,
        date: currentEvent.date.split("T")[0],
        location: currentEvent.location || "",
        category: currentEvent.category || "",
        capacity: currentEvent.capacity || "",
        status: currentEvent.status || "pending",
        image: currentEvent.image || null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        capacity: "",
        status: "pending",
        image: null,
      });
    }
  }, [currentEvent]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      if (currentEvent) {
        await dispatch(
          updateEvent({ id: currentEvent._id, updatedData: formDataToSubmit })
        ).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await dispatch(createEvent(formDataToSubmit)).unwrap();
        toast.success("Event created successfully!");
      }
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        capacity: "",
        status: "pending",
        image: null,
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-10">
          <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-11/12 sm:w-96 ${loading && "opacity-50"}`}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4">
          {currentEvent ? "Edit Event" : "Create Event"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select a category
              </option>
              {["Workshop", "Seminar", "Cultural", "Sports"].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
            disabled={loading}
          />
        </div>
        {formData.image && (
          <div className="mb-4">
            <p>Selected Image: {formData.image.name}</p>
          </div>
        )}
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="border border-teal-600 text-teal-600 px-4 py-2 rounded hover:bg-teal-600 hover:text-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            disabled={loading}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  ) : null;
};

export default EventFormModal;
