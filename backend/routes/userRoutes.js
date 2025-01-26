const express = require("express");
const { authorizeRoles, authenticateUser } = require("../middlewares/authMiddleware");
const { getAllUsers, changeUserRole } = require("../controllers/userController");

const router = express.Router();


router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);
router.patch("/change-role",authenticateUser,authorizeRoles("admin"),changeUserRole);

module.exports = router;