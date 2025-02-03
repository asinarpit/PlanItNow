const cloudinary = require("../config/cloudinary");
const Event = require("../models/Event");

// Fetch all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("participants")
      .populate("createdBy");
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
      .populate("createdBy");

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
      .populate("createdBy");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, category, capacity, status } =
    req.body;

  console.log(req.user);
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const createdBy = req.user.id;

  try {
    let imageUrl = null;

    if (req.file) {
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
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      category,
      capacity,
      status: status || "pending",
      createdBy,
      image: imageUrl,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, category, capacity, status } =
    req.body;

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    let imageUrl = null;

    if (req.file) {
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
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        location,
        category,
        capacity,
        ...(status && { status }),
        ...(imageUrl && { image: imageUrl }),
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

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
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
      .populate("createdBy");
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
      .populate("createdBy");
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
      .populate("createdBy");
    res.status(200).json(featuredEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch events by category
exports.getCategoryEvents = async (req, res) => {
  const { category } = req.params;
  try {
    const categoryEvents = await Event.find({ category })
      .populate("participants")
      .populate("createdBy");
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

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.participants.includes(req.user.id)) {
      if (event.participants.length >= event.capacity) {
        return res
          .status(400)
          .json({ message: "Event has reached maximum capacity" });
      }

      event.participants.push(req.user.id);
      await event.save();

      return res.status(200).json({
        message: "Registration successful",
        event,
      });
    }

    // If the user is already registered, unregister them
    event.participants = event.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );
    await event.save();

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

    res.status(200).json({
      message: isRegistered ? "User is registered" : "User is not registered",
      isRegistered,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
