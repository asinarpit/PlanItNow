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

module.exports = { getAllUsers, changeUserRole, deleteUser };
