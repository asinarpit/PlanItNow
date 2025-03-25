const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const eventSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 150 }, 
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
    endDate: { type: Date }, 
    location: { type: String, required: true },
    virtualEventLink: { type: String }, 

    // Organizer Details
    organizer: {
      name: { type: String, required: true }, 
      contactEmail: { type: String },
      contactPhone: { type: String },
      facultyCoordinator: { type: String }, 
      studentCoordinator: { type: String }, 
    },

    // Participants
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    capacity: { type: Number, required: true },
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    eligibility: { type: String }, 

    // Media
    image: { type: String }, 
    gallery: [{ type: String }], 
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
        speaker: { type: String }, 
      },
    ],

    // Registration Details
    registrationRequired: { type: Boolean, default: true },
    registrationDeadline: { type: Date },
    registrationFee: { type: Number, default: 0 },    

    // Social Media Links
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },

    // Additional Metadata
    targetAudience: { type: String }, 
    prerequisites: { type: String }, 
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

eventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Event", eventSchema);