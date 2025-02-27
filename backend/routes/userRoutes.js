const express = require("express");
const {
  authorizeRoles,
  authenticateUser,
} = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  changeUserRole,
  deleteUser,
  removeDeviceToken,
  updateUser,
} = require("../controllers/userController");
const upload = require("../config/multer");

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);
router.put("/:userId", upload, authenticateUser, updateUser);
router.patch(
  "/change-role",
  authenticateUser,
  authorizeRoles("admin", "faculty"),
  changeUserRole
);
router.delete("/remove-device-token", authenticateUser, removeDeviceToken);
router.delete(
  "/:userId",
  authenticateUser,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;
