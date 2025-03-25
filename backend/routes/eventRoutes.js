const express = require("express");
const upload = require("../config/multer");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  featureEvent,
  toggleRegistration,
  checkRegistrationStatus,
  getEventsByUser,
  getRegisteredEvents,
  getPaginatedEvents,
  getSimilarEvents,
  checkInParticipant,
  approveEvent,
  sendEventNotification,
  exportEvents,
  getEventStats,
  searchEvents,
  getEventCategories,
} = require("../controllers/eventController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/", getAllEvents);
router.get('/paginated', getPaginatedEvents);
router.get('/categories', getEventCategories);
router.get('/search', searchEvents);
router.get('/stats', getEventStats);
router.get('/export', exportEvents);
router.post('/:id/notify', sendEventNotification);
router.put('/:id/approve', approveEvent);
router.post('/:eventId/checkin/:userId', checkInParticipant);
router.get('/:id/similar', getSimilarEvents);

router.get(
  "/user/events",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  getEventsByUser
);
router.get("/user/registered", authenticateUser, getRegisteredEvents);
router.get("/:id", getEventById);
router.patch(
  "/:id/feature",
  authenticateUser,
  authorizeRoles("admin"),
  featureEvent
);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  upload,
  createEvent
);


router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  upload,
  updateEvent
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  deleteEvent
);
router.post(
  "/:id/register",
  authenticateUser,
  authorizeRoles("faculty", "student", "admin"),
  toggleRegistration
);
router.get(
  "/:id/check-registration",
  authenticateUser,
  checkRegistrationStatus
);
router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  updateEventStatus
);

module.exports = router;
