const express = require("express");
const { signup, login, updateDeviceToken } = require("../controllers/authController");
const {
  authenticateUser,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-device-token",authenticateUser, updateDeviceToken);

module.exports = router;
