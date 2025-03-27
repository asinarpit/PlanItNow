const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["selected", "all"], required: true },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
