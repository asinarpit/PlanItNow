const express = require("express");
const router = express.Router();
const {
  sendNotificationToAllUsers,
  sendNotificationToUsers,
} = require("../controllers/firebaseController");

router.post("/send-notification", sendNotificationToUsers);

router.post("/send-notification/all", sendNotificationToAllUsers);

module.exports = router;
