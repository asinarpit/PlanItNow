const express = require("express");
const router = express.Router();
const {
  sendNotificationToAllUsers,
  sendNotificationToUsers,
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, getNotificationsForUser);
router.patch("/:notificationId/mark-read", authenticateUser, markNotificationAsRead);
router.patch("/mark-all-read", authenticateUser, markAllNotificationsAsRead);

router.post("/send-notification", sendNotificationToUsers);

router.post("/send-notification/all", sendNotificationToAllUsers);

module.exports = router;
