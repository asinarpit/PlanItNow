// routes/feedbackRoutes.js
const express = require("express");
const {
  getFeedbackForEvent,
  createFeedback,
} = require("../controllers/feedbackController");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to get all feedback for an event
router.get(
  "/event/:eventId",
  authenticateUser,
  authorizeRoles("admin"),
  getFeedbackForEvent
);

// Route to create new feedback for an event
router.post(
  "/event/:eventId",
  authenticateUser,
  authorizeRoles("admin"),
  createFeedback
);

module.exports = router;
