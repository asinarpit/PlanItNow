const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authenticateUser,
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;
