// controllers/feedbackController.js
const Feedback = require("../models/Feedback");

// Controller to get all feedback for an event
const getFeedbackForEvent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ eventId: req.params.eventId })
      .populate("userId", "name email");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller to create new feedback
const createFeedback = async (req, res) => {
  const { userId, rating, comment } = req.body;

  try {
    const feedback = new Feedback({
      eventId: req.params.eventId,
      userId,
      rating,
      comment,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFeedbackForEvent, createFeedback };
