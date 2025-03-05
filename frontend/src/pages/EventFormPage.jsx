import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { createEvent, updateEvent } from "../features/event/eventsSlice";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

const EventFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events } = useSelector((state) => state.events);
  const { eventId } = useParams();
  const currentEvent = events?.find((event) => event._id === eventId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    eventType: "",
    department: "",
    date: "",
    endDate: "",
    location: "",
    virtualEventLink: "",
    organizer: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      facultyCoordinator: "",
      studentCoordinator: "",
    },
    capacity: "",
    eligibility: "",
    image: null,
    gallery: [],
    attachments: [],
    agenda: [],
    registrationRequired: true,
    registrationDeadline: "",
    registrationFee: 0,
    paymentLink: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    targetAudience: "",
    prerequisites: "",
    isFeatured: false,
    status: "pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      const formattedAgenda = currentEvent.agenda.map((item) => ({
        ...item,
        startTime: item.startTime ? item.startTime.split('.')[0] : "",
        endTime: item.endTime ? item.endTime.split('.')[0] : "",
      }));
      setFormData({
        title: currentEvent.title,
        description: currentEvent.description,
        shortDescription: currentEvent.shortDescription || "",
        eventType: currentEvent.eventType || "",
        department: currentEvent.department || "",
        date: currentEvent.date.split("T")[0],
        endDate: currentEvent.endDate ? currentEvent.endDate.split("T")[0] : "",
        location: currentEvent.location || "",
        virtualEventLink: currentEvent.virtualEventLink || "",
        organizer: {
          name: currentEvent.organizer?.name || "",
          contactEmail: currentEvent.organizer?.contactEmail || "",
          contactPhone: currentEvent.organizer?.contactPhone || "",
          facultyCoordinator: currentEvent.organizer?.facultyCoordinator || "",
          studentCoordinator: currentEvent.organizer?.studentCoordinator || "",
        },
        capacity: currentEvent.capacity || "",
        eligibility: currentEvent.eligibility || "",
        image: currentEvent.image || null,
        gallery: currentEvent.gallery || [],
        attachments: currentEvent.attachments || [],
        agenda: formattedAgenda || [],
        registrationRequired: currentEvent.registrationRequired || true,
        registrationDeadline: currentEvent.registrationDeadline ? currentEvent.registrationDeadline.split("T")[0] : "",
        registrationFee: currentEvent.registrationFee || 0,
        paymentLink: currentEvent.paymentLink || "",
        socialMedia: {
          facebook: currentEvent.socialMedia?.facebook || "",
          instagram: currentEvent.socialMedia?.instagram || "",
          twitter: currentEvent.socialMedia?.twitter || "",
        },
        targetAudience: currentEvent.targetAudience || "",
        prerequisites: currentEvent.prerequisites || "",
        isFeatured: currentEvent.isFeatured || false,
        status: currentEvent.status || "pending",
      });
    }
  }, [currentEvent]);


  // Dropzone configurations
  const imageDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    multiple: false,
    onDrop: acceptedFiles => {
      setFormData({ ...formData, image: acceptedFiles[0] });
    },
  });

  const galleryDropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    multiple: true,
    onDrop: acceptedFiles => {
      setFormData({ ...formData, gallery: [...formData.gallery, ...acceptedFiles] });
    },
  });

  const attachmentsDropzone = useDropzone({
    multiple: true,
    onDrop: acceptedFiles => {
      setFormData({ ...formData, attachments: [...formData.attachments, ...acceptedFiles] });
    },
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "attachments") {
      setFormData({ ...formData, attachments: [...files] });
    }
    else if (name.startsWith("organizer.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        organizer: {
          ...formData.organizer,
          [field]: value,
        },
      });
    } else if (name.startsWith("socialMedia.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [field]: value,
        },
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "gallery") {
      setFormData({ ...formData, gallery: [...files] });
    }
    else if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAgendaChange = (index, field, value) => {
    const updatedAgenda = [...formData.agenda];
    updatedAgenda[index][field] = value;
    setFormData({ ...formData, agenda: updatedAgenda });
  };

  const handleAddAgenda = () => {
    setFormData({
      ...formData,
      agenda: [
        ...formData.agenda,
        {
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          speaker: "",
        },
      ],
    });
  };

  const handleRemoveAgenda = (index) => {
    const updatedAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: updatedAgenda });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSubmit = new FormData();

    // Append all fields except nested objects and arrays
    Object.keys(formData).forEach((key) => {
      if (formData[key] && !["organizer", "socialMedia", "agenda", "gallery", "attachments", "image"].includes(key)) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append nested fields as JSON strings
    formDataToSubmit.append("organizer", JSON.stringify(formData.organizer));
    formDataToSubmit.append("socialMedia", JSON.stringify(formData.socialMedia));

    console.log(formData.image);

    if (formData.image) {
      formDataToSubmit.append("image", formData.image);
    }

    // Append gallery files
    if (formData.gallery && formData.gallery.length > 0) {
      formData.gallery.forEach((file, index) => {
        formDataToSubmit.append(`gallery`, file);
      });
    }

    // Append attachments
    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach((file, index) => {
        formDataToSubmit.append(`attachments`, file);
      });
    }

    // Append agenda as an array of objects
    if (formData.agenda && formData.agenda.length > 0) {
      formData.agenda.forEach((agendaItem, index) => {
        Object.keys(agendaItem).forEach((field) => {
          formDataToSubmit.append(`agenda[${index}][${field}]`, agendaItem[field]);
        });
      });
    }

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
      navigate(-1);
    } catch (error) {
      toast.error("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CgSpinner className="animate-spin text-teal-600 w-10 h-10" />
      </div>
    );
  }



  return (
    <div className="min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">
        {currentEvent ? "Edit Event" : "Create Event"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
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
            <label className="block mb-2">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
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
            <label className="block mb-2">Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select Event Type
              </option>
              {["Academic", "Cultural", "Sports", "Technical", "Workshop", "Seminar", "Other"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select Department
              </option>
              {["CSE", "ECE", "ME", "CE", "EEE", "IT", "General"].map(
                (dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Event Date</label>
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
            <label className="block mb-2">Event End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
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
            <label className="block mb-2">Event Attachments</label>
            <div
              {...attachmentsDropzone.getRootProps()}
              className={`border-2 border-dashed p-4 rounded cursor-pointer dark:border-gray-700 ${attachmentsDropzone.isDragActive ? "border-teal-600 bg-teal-50 dark:bg-teal-900" : ""
                }`}
            >
              <input {...attachmentsDropzone.getInputProps()} />
              <p className="text-center">
                Drag & drop attachments here, or click to select
              </p>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Selected Attachments:</p>
                <ul className="list-disc pl-5">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="break-all">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Virtual Event Link</label>
            <input
              type="url"
              name="virtualEventLink"
              value={formData.virtualEventLink}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Organizer Name</label>
            <input
              type="text"
              name="organizer.name"
              value={formData.organizer.name}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Organizer Contact Email</label>
            <input
              type="email"
              name="organizer.contactEmail"
              value={formData.organizer.contactEmail}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Organizer Contact Phone</label>
            <input
              type="tel"
              name="organizer.contactPhone"
              value={formData.organizer.contactPhone}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Faculty Coordinator</label>
            <input
              type="text"
              name="organizer.facultyCoordinator"
              value={formData.organizer.facultyCoordinator}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Student Coordinator</label>
            <input
              type="text"
              name="organizer.studentCoordinator"
              value={formData.organizer.studentCoordinator}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              required
              disabled={loading}
            />
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
            <label className="block mb-2">Eligibility</label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Event Image</label>
            <div
              {...imageDropzone.getRootProps()}
              className={`border-2 border-dashed p-4 rounded cursor-pointer dark:border-gray-700 ${imageDropzone.isDragActive ? "border-teal-600 bg-teal-50 dark:bg-teal-900" : ""
                }`}
            >
              <input {...imageDropzone.getInputProps()} />
              {formData.image ? (
                typeof formData.image === "string" ? (
                  <div className="text-center">
                    <p>Current Image:</p>
                    <img
                      src={formData.image}
                      alt="Event"
                      className="h-24 w-auto mx-auto mt-2"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Drag & drop a new image or click to replace
                    </p>
                  </div>
                ) : (
                  <p className="text-center">Selected: {formData.image.name}</p>
                )
              ) : (
                <p className="text-center">
                  Drag & drop an image here, or click to select
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Event Gallery Images</label>
            <div
              {...galleryDropzone.getRootProps()}
              className={`border-2 border-dashed p-4 rounded cursor-pointer dark:border-gray-700 ${galleryDropzone.isDragActive ? "border-teal-600 bg-teal-50 dark:bg-teal-900" : ""
                }`}
            >
              <input {...galleryDropzone.getInputProps()} />
              <p className="text-center">
                Drag & drop gallery images here, or click to select
              </p>
            </div>
            {(formData.gallery.length > 0 || (currentEvent?.gallery?.length > 0)) && (
              <div className="mt-4">
                <p className="font-medium mb-2">Selected Gallery Images:</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.gallery.map((file, index) => (
                    <div key={index} className="relative group">
                      {typeof file === "string" ? (
                        <img
                          src={file}
                          alt={`Gallery ${index}`}
                          className="h-24 w-full object-cover rounded"
                        />
                      ) : (
                        <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-sm">{file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Registration Required</label>
            <input
              type="checkbox"
              name="registrationRequired"
              checked={formData.registrationRequired}
              onChange={handleChange}
              className="mr-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Registration Deadline</label>
            <input
              type="date"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Registration Fee</label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Payment Link</label>
            <input
              type="url"
              name="paymentLink"
              value={formData.paymentLink}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Facebook Link</label>
            <input
              type="url"
              name="socialMedia.facebook"
              value={formData.socialMedia.facebook}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Instagram Link</label>
            <input
              type="url"
              name="socialMedia.instagram"
              value={formData.socialMedia.instagram}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Twitter Link</label>
            <input
              type="url"
              name="socialMedia.twitter"
              value={formData.socialMedia.twitter}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Target Audience</label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Prerequisites</label>
            <input
              type="text"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              className="w-full p-2 border dark:border-gray-700 rounded dark:bg-gray-800"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Featured Event</label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="mr-2"
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
              required
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Event Agenda</label>
          {formData.agenda.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Session Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleAgendaChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2">Speaker</label>
                  <input
                    type="text"
                    value={item.speaker}
                    onChange={(e) =>
                      handleAgendaChange(index, "speaker", e.target.value)
                    }
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    value={item.startTime}
                    onChange={(e) =>
                      handleAgendaChange(index, "startTime", e.target.value)
                    }
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    value={item.endTime}
                    onChange={(e) =>
                      handleAgendaChange(index, "endTime", e.target.value)
                    }
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAgenda(index)}
                className="mt-2 text-red-500"
              >
                Remove Session
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAgenda}
            className="mt-2 text-teal-600"
          >
            Add Session
          </button>
        </div>
        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
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
  );
};

export default EventFormPage;

