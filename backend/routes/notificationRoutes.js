const express = require("express");
const router = express.Router();
const {
  sendNotificationToAllUsers,
  sendNotificationToUsers,
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, getNotificationsForUser);
router.patch("/:notificationId/mark-read", authenticateUser, markNotificationAsRead);
router.patch("/mark-all-read", authenticateUser, markAllNotificationsAsRead);

router.post("/send-notification", authenticateUser, authorizeRoles("admin", "faculty"), sendNotificationToUsers);

router.post("/send-notification/all", authenticateUser, authorizeRoles("admin"), sendNotificationToAllUsers);

module.exports = router;
