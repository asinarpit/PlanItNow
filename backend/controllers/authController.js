const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/nodemailer");


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

    user.deviceTokens.addToSet(deviceToken);
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
      deviceTokens: deviceToken ? [deviceToken] : [],
    });
    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        token,
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        deviceTokens: user.deviceTokens,
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
      user.deviceTokens.addToSet(deviceToken);
      await user.save();
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      _id: user._id,
      role: user.role,
      name: user.name,
      image: user.image,
      email: user.email,
      deviceTokens: user.deviceTokens,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ 
        message: "If your email is registered, you will receive a password reset link." 
      });
    }

    if (!user.password) {
      return res.status(400).json({ 
        message: "Account uses social login. Please sign in with Google." 
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; 
    await user.save();

    const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password/${resetToken}`;

    console.log('Password reset URL:', resetUrl);

 await sendPasswordResetEmail(user.email, user, resetUrl);
    res.status(200).json({ 
      message: "Password reset link sent to your email." 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
  updateDeviceToken,
  forgotPassword,
  resetPassword
};
