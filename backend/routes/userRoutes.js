const express = require("express");
const {
  authorizeRoles,
  authenticateUser,
} = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  changeUserRole,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);
router.patch(
  "/change-role",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  changeUserRole
);
router.delete(
  "/:userId",
  authenticateUser,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;
