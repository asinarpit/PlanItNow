const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 150 }, // For event cards
    eventType: {
      type: String,
      enum: ["Academic", "Cultural", "Sports", "Technical", "Workshop", "Seminar", "Other"],
      required: true,
    },
    department: {
      type: String,
      enum: ["CSE", "ECE", "ME", "CE", "EEE", "IT", "General"],
      required: true,
    },
    date: { type: Date, required: true },
    endDate: { type: Date }, // For multi-day events
    location: { type: String, required: true },
    virtualEventLink: { type: String }, // For hybrid or online events

    // Organizer Details
    organizer: {
      name: { type: String, required: true }, // Club or department name
      contactEmail: { type: String },
      contactPhone: { type: String },
      facultyCoordinator: { type: String }, // Faculty in charge
      studentCoordinator: { type: String }, // Student in charge
    },

    // Participants
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    capacity: { type: Number, required: true },
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For over-capacity events
    eligibility: { type: String }, // E.g., "All students", "CSE students only"

    // Media
    image: { type: String }, // Main event banner
    gallery: [{ type: String }], // Additional images
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],

    // Event Agenda
    agenda: [
      {
        title: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        speaker: { type: String }, // Name of the speaker or session host
      },
    ],

    // Registration Details
    registrationRequired: { type: Boolean, default: true },
    registrationDeadline: { type: Date },
    registrationFee: { type: Number, default: 0 }, // Free by default
    paymentLink: { type: String }, // Link for payment (if applicable)

    // Social Media Links
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },

    // Additional Metadata
    targetAudience: { type: String }, // E.g., "1st Year Students", "All Students"
    prerequisites: { type: String }, // E.g., "Basic knowledge of Python"
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },

    // Created By
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);