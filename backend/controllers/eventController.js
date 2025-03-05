const cloudinary = require("../config/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");

// Fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all events created by a specific user
exports.getEventsByUser = async (req, res) => {
  const userId = req.user.id;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const events = await Event.find({ createdBy: userId })
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch events a student has registered for
exports.getRegisteredEvents = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const events = await Event.find({ participants: req.user.id })
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");

    if (events.length === 0) {
      return res.status(404).json({ message: "No registered events found" });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    eventType,
    department,
    date,
    endDate,
    location,
    virtualEventLink,
    organizer,
    capacity,
    eligibility,
    registrationRequired,
    registrationDeadline,
    registrationFee,
    paymentLink,
    targetAudience,
    prerequisites,
    agenda,
    socialMedia,
    tags,
  } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const createdBy = req.user.id;

  try {
    let imageUrl = null;
    let galleryUrls = [];

    const parsedOrganizer = organizer ? JSON.parse(organizer) : null;
    const parsedSocialMedia = socialMedia ? JSON.parse(socialMedia) : null;

    let attachmentUrls = [];

    // Upload attachments
    if (req.files && req.files.attachments) {
      for (const file of req.files.attachments) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "events/attachments" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        attachmentUrls.push({
          name: file.originalname,
          url: result.secure_url,
        });
      }
    }

    // Upload main image
    if (req.files && req.files.image) {
      const file = req.files.image[0];
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Upload gallery images
    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "events/gallery" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        galleryUrls.push(result.secure_url);
      }
    }

    const newEvent = await Event.create({
      title,
      description,
      shortDescription,
      eventType,
      department,
      date,
      endDate,
      location,
      virtualEventLink,
      organizer: parsedOrganizer
        ? {
            name: parsedOrganizer.name,
            contactEmail: parsedOrganizer.contactEmail,
            contactPhone: parsedOrganizer.contactPhone,
            facultyCoordinator: parsedOrganizer.facultyCoordinator,
            studentCoordinator: parsedOrganizer.studentCoordinator,
          }
        : null,
      capacity,
      eligibility,
      registrationRequired,
      registrationDeadline,
      registrationFee,
      paymentLink,
      targetAudience,
      prerequisites,
      agenda,
      socialMedia: parsedSocialMedia,
      tags,
      image: imageUrl,
      gallery: galleryUrls,
      attachments: attachmentUrls,
      createdBy,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    shortDescription,
    eventType,
    department,
    date,
    endDate,
    location,
    virtualEventLink,
    organizer,
    capacity,
    eligibility,
    registrationRequired,
    registrationDeadline,
    registrationFee,
    paymentLink,
    targetAudience,
    prerequisites,
    agenda,
    socialMedia,
    tags,
  } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    let imageUrl = null;
    let galleryUrls = [];
    let attachmentUrls = [];

    const parsedOrganizer = organizer ? JSON.parse(organizer) : null;
    const parsedSocialMedia = socialMedia ? JSON.parse(socialMedia) : null;

    // Upload attachments
    if (req.files && req.files.attachments) {
      for (const file of req.files.attachments) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "events/attachments" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        attachmentUrls.push({
          name: file.originalname,
          url: result.secure_url,
        });
      }
    }

    // Upload main image
    if (req.files && req.files.image) {
      const file = req.files.image[0];
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Upload gallery images
    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "events/gallery" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        galleryUrls.push(result.secure_url);
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        shortDescription,
        eventType,
        department,
        date,
        endDate,
        location,
        virtualEventLink,
        organizer: parsedOrganizer
          ? {
              name: parsedOrganizer.name,
              contactEmail: parsedOrganizer.contactEmail,
              contactPhone: parsedOrganizer.contactPhone,
              facultyCoordinator: parsedOrganizer.facultyCoordinator,
              studentCoordinator: parsedOrganizer.studentCoordinator,
            }
          : null,
        capacity,
        eligibility,
        registrationRequired,
        registrationDeadline,
        registrationFee,
        paymentLink,
        targetAudience,
        prerequisites,
        agenda,
        socialMedia: parsedSocialMedia,
        tags,
        ...(imageUrl && { image: imageUrl }),
        ...(galleryUrls.length > 0 && { gallery: galleryUrls }),
        ...(attachmentUrls.length > 0 && { attachments: attachmentUrls }),
      },
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update the status of an event
exports.updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (
    !status ||
    !["pending", "approved", "rejected", "cancelled"].includes(status)
  ) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch new events (events created recently)
exports.getNewEvents = async (req, res) => {
  try {
    const newEvents = await Event.find({
      createdAt: { $gte: new Date() - 7 * 24 * 60 * 60 * 1000 },
    }) // events created in the last 7 days
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    res.status(200).json(newEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ date: { $gt: new Date() } })
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    res.status(200).json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch featured events (events marked as featured)
exports.getFeaturedEvents = async (req, res) => {
  try {
    const featuredEvents = await Event.find({ isFeatured: true })
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    res.status(200).json(featuredEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch events by category
exports.getCategoryEvents = async (req, res) => {
  const { category } = req.params;
  try {
    const categoryEvents = await Event.find({ eventType: category })
      .populate("participants")
      .populate("createdBy")
      .populate("waitlist");
    res.status(200).json(categoryEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Toggle the featured status of an event
exports.featureEvent = async (req, res) => {
  const { id } = req.params;
  const { isFeatured } = req.body;

  if (typeof isFeatured !== "boolean") {
    return res.status(400).json({
      message: "Invalid value for 'isFeatured'. It must be a boolean.",
    });
  }

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Register or unregister a student for an event
exports.toggleRegistration = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const event = await Event.findById(id);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isRegistered = event.participants.includes(req.user.id);

    if (!isRegistered) {
      if (event.participants.length >= event.capacity) {
        event.waitlist.push(req.user.id);
        await event.save();
        return res.status(200).json({
          message: "Event is full. Added to waitlist.",
          event,
        });
      }

      event.participants.push(req.user.id);
      user.eventsParticipated.push(event._id);
      await event.save();
      await user.save();
      return res.status(200).json({
        message: "Registration successful",
        event,
      });
    }

    event.participants = event.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );
    user.eventsParticipated = user.eventsParticipated.filter(
      (eventId) => eventId.toString() !== event._id.toString()
    );
    await event.save();
    await user.save();

    res.status(200).json({
      message: "Unregistration successful",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Check if a user is registered for an event
exports.checkRegistrationStatus = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isRegistered = event.participants.includes(req.user.id);
    const isOnWaitlist = event.waitlist.includes(req.user.id);

    res.status(200).json({
      message: isRegistered
        ? "User is registered"
        : isOnWaitlist
        ? "User is on waitlist"
        : "User is not registered",
      isRegistered,
      isOnWaitlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only allow admins or the event creator to delete the event
    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Permission denied" });
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
