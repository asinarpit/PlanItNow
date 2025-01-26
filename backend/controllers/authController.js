const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const updateDeviceToken = async (req, res) => {
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

    user.deviceToken = deviceToken;
    await user.save();

    res.status(200).json({ message: "Device token updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const signup = async (req, res) => {
  const { name, email, password, role, deviceToken } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      deviceToken,
    });
    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        token,
        role: user.role,
        name: user.name,
        email: user.email,
        deviceToken: user.deviceToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password, deviceToken } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      deviceToken: user.deviceToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  signup,
  login,
  updateDeviceToken,
};
