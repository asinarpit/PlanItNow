const express = require("express");
const {getAdminDashboardStats, getFacultyDashboardStats, getStudentDashboardStats } = require("../controllers/dashboardController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/stats/admin",
  authenticateUser,
  authorizeRoles("admin"),
  getAdminDashboardStats
);


router.get(
  "/stats/faculty",
  authenticateUser,
  authorizeRoles("faculty", "admin"),
  getFacultyDashboardStats
)


router.get(
  "/stats/student",
  authenticateUser,
  getStudentDashboardStats
)

module.exports = router;
