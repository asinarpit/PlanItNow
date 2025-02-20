const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params; // User ID passed as a URL parameter

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne(); 
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeDeviceToken = async (req, res) => {
  const { deviceToken } = req.body;
  const userId = req.user.id; 

  if (!deviceToken) {
    return res.status(400).json({ message: "Device token is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.deviceTokens = user.deviceTokens.filter(token => token !== deviceToken);
    await user.save();

    return res.status(200).json({ message: "Device token removed successfully" });
  } catch (error) {
    console.error("Error removing device token:", error);
    return res.status(500).json({
      message: "Error removing device token",
      error: error.message,
    });
  }
};




module.exports = { getAllUsers, changeUserRole, deleteUser, removeDeviceToken};
