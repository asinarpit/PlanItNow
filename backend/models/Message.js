const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: function() {
      return this.attachments.length === 0;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Event",
    required: true
  },
  attachments: [{
    url: String,
    filename: String,
    contentType: String,
    filesize: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", MessageSchema);