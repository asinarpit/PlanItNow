const express = require("express");
const upload = require("../config/multer");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getNewEvents,
  getUpcomingEvents,
  getFeaturedEvents,
  getCategoryEvents,
  featureEvent,
  toggleRegistration,
  checkRegistrationStatus,
} = require("../controllers/eventController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/new", getNewEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/featured", getFeaturedEvents);
router.get("/category/:category", getCategoryEvents);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.patch("/:id/feature", authenticateUser, featureEvent);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  upload.single("image"),
  createEvent
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  upload.single("image"),
  updateEvent
);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteEvent);
router.post(
  "/:id/register",
  authenticateUser,
  authorizeRoles("faculty", "student", "admin"),
  toggleRegistration
);
router.get("/:id/check-registration",authenticateUser, checkRegistrationStatus);
router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  updateEventStatus
);

module.exports = router;
