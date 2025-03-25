const cloudinary = require("../config/cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");
const Payment = require("../models/Payment");
const sendNotification = require("../services/notificationService");
const Notification = require("../models/Notification");

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

    // Send notification to all users about the new event
    try {
      const users = await User.find({}).select("_id deviceTokens");
      const deviceTokens = users.flatMap((user) => user.deviceTokens || []);

      if (deviceTokens.length > 0) {
        await sendNotification(
          "New Event Created",
          `A new event "${title}" has been added. Check it out!`,
          deviceTokens
        );
      }

      // Save notification to the database
      await Notification.create({
        title: "New Event Created",
        body: `A new event "${title}" has been added.`,
        type: "all",
        recipients: users.map((user) => user._id),
      });
    } catch (error) {
      console.error("Error sending notification for new event:", error);
    }

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

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isRegistered = event.participants.includes(req.user.id);
    const isOnWaitlist = event.waitlist.includes(req.user.id);

    // Unregister user if already registered
    if (isRegistered || isOnWaitlist) {
      event.participants.pull(req.user.id);
      event.waitlist.pull(req.user.id);
      user.eventsParticipated.pull(event._id);

      // Delete payment record if exists
      if (event.registrationFee > 0) {
        await Payment.deleteOne({ user: req.user.id, event: event._id });
      }

      await event.save();
      await user.save();
      return res.status(200).json({
        message: "Unregistered from event successfully",
        event,
      });
    }

    // Register user
    if (event.participants.length >= event.capacity) {
      event.waitlist.push(req.user.id);
      await event.save();
      return res.status(200).json({
        message: "Added to waitlist as event is full",
        event,
      });
    }

    // Payment validation for paid events
    if (event.registrationFee > 0) {
      const validPayment = await Payment.findOne({
        user: req.user.id,
        event: event._id,
        status: "paid",
      });

      if (!validPayment) {
        return res.status(403).json({
          message:
            "Payment required for event registration. Please complete payment first.",
        });
      }
    }

    // Registration capacity check
    if (event.participants.length >= event.capacity) {
      event.waitlist.push(req.user.id);
      await event.save();
      return res.status(200).json({
        message: "Added to waitlist as event is full",
        event,
      });
    }

    event.participants.push(req.user.id);
    user.eventsParticipated.push(event._id);

    await event.save();
    await user.save();

    res.status(200).json({
      message: "Registered for event successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

// Get paginated and filtered events (for events listing page)
exports.getPaginatedEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      category,
      status,
      search,
      upcoming,
      featured,
      new: newEvents,
    } = req.query;

    const query = {};

    const sortMapping = {
      newest: "-createdAt",
      oldest: "createdAt",
      popular: "-participantsCount"
    };

    const sortBy = sortMapping[sort] || "-createdAt";

    // Category filter
    if (category) {
      query.eventType = { $in: category.split(",") };
    }

    // Status filter
    if (status) {
      query.status = { $in: status.split(",") };
    }

    // Upcoming events filter
    if (upcoming === "true") {
      query.date = { $gt: new Date() };
    }

    // Featured filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    // New events filter (created in last 7 days)
    if (newEvents === "true") {
      query.createdAt = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortBy,
      populate: ["participants", "createdBy", "waitlist"],
    };

    const result = await Event.paginate(query, options);

    res.status(200).json({
      events: result.docs,
      total: result.totalDocs,
      limit: result.limit,
      page: result.page,
      pages: result.totalPages,
      hasNext: result.hasNextPage,
      hasPrev: result.hasPrevPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getEventCategories = async (req, res) => {
  try {
    const categories = await Event.distinct("eventType");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Search events with full-text search
exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    const results = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .populate("createdBy");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $facet: {
          totalEvents: [{ $count: "count" }],
          eventsByStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          eventsByType: [{ $group: { _id: "$eventType", count: { $sum: 1 } } }],
          participationStats: [
            {
              $project: {
                participantsCount: { $size: "$participants" },
                waitlistCount: { $size: "$waitlist" },
              },
            },
            {
              $group: {
                _id: null,
                totalParticipants: { $sum: "$participantsCount" },
                totalWaitlist: { $sum: "$waitlistCount" },
                avgParticipation: { $avg: "$participantsCount" },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Export events data
exports.exportEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();

    // Transform data for CSV/excel export
    const data = events.map((event) => ({
      Title: event.title,
      Type: event.eventType,
      Status: event.status,
      Date: event.date,
      Participants: event.participants.length,
      Capacity: event.capacity,
      Created_By: event.createdBy,
      Registration_Fee: event.registrationFee,
      Department: event.department,
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Send notification to event participants
exports.sendEventNotification = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const event = await Event.findById(id).populate("participants");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const participants = event.participants;
    const deviceTokens = participants.flatMap((p) => p.deviceTokens || []);

    if (deviceTokens.length > 0) {
      await sendNotification(
        `Update for ${event.title}`,
        message,
        deviceTokens
      );
    }

    // Save notification to database
    await Notification.create({
      title: `Event Update: ${event.title}`,
      body: message,
      type: "event",
      recipients: participants.map((p) => p._id),
      referenceId: event._id,
    });

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Admin approval for events
exports.approveEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Notify event creator
    const creator = await User.findById(event.createdBy);
    if (creator && creator.deviceTokens.length > 0) {
      await sendNotification(
        "Event Approved",
        `Your event "${event.title}" has been approved`,
        creator.deviceTokens
      );
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Check-in participant
exports.checkInParticipant = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User not registered for this event" });
    }

    if (event.checkedInParticipants.includes(userId)) {
      return res.status(400).json({ message: "User already checked in" });
    }

    event.checkedInParticipants.push(userId);
    await event.save();

    res.status(200).json({ message: "Check-in successful", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get similar events
exports.getSimilarEvents = async (req, res) => {
  const { id } = req.params;

  try {
    const currentEvent = await Event.findById(id);
    if (!currentEvent)
      return res.status(404).json({ message: "Event not found" });

    const similarEvents = await Event.find({
      $or: [
        { eventType: currentEvent.eventType },
        { department: currentEvent.department },
        { tags: { $in: currentEvent.tags } },
      ],
      _id: { $ne: id },
    })
      .limit(5)
      .populate("createdBy");

    res.status(200).json(similarEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
