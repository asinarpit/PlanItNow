const Notification = require("../models/Notification");
const User = require("../models/User");
const sendNotification = require("../services/notificationService");

// Send notification to single or multiple users
const sendNotificationToUsers = async (req, res) => {
  const { title, body, deviceTokens } = req.body;

  if (
    !title ||
    !body ||
    !deviceTokens ||
    (Array.isArray(deviceTokens) && deviceTokens.length === 0)
  ) {
    return res.status(400).json({
      message: "Title, body, and at least one deviceToken are required",
    });
  }

  const tokens = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];

  try {
    // Find users who have at least one of the provided tokens
    const users = await User.find({ deviceTokens: { $in: tokens } }).select(
      "_id deviceTokens"
    );

    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "No users found for the given device tokens" });
    }

    // Extract all device tokens from found users
    const allTokens = users.flatMap((user) => user.deviceTokens);

    await sendNotification(title, body, allTokens);

    // Save notification to the database
    await Notification.create({
      title,
      body,
      type: "selected",
      recipients: users.map((user) => user._id),
      sender: req.user.id
    });

    return res.status(200).json({
      message: `Notification sent successfully to ${
        tokens.length === 1 ? "single user" : "multiple users"
      }`,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return res
      .status(500)
      .json({ message: "Error sending notifications", error: error.message });
  }
};

// Send notification to all users
const sendNotificationToAllUsers = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    const users = await User.find({}).select("_id deviceTokens");

    // Extract all device tokens
    const deviceTokens = users.flatMap((user) => user.deviceTokens || []);

    if (deviceTokens.length === 0) {
      return res.status(400).json({ message: "No device tokens found" });
    }

    await sendNotification(title, body, deviceTokens);

    // Save notification to the database
    await Notification.create({
      title,
      body,
      type: "all",
      recipients: users.map((user) => user._id),
      sender: req.user.id
    });

    return res
      .status(200)
      .json({ message: "Notifications sent successfully to all users" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return res
      .status(500)
      .json({ message: "Error sending notifications", error: error.message });
  }
};

// Fetch notifications for the user
const getNotificationsForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({
      recipients: userId,
    })
      .select("title body createdAt readBy")
      .populate("sender", "name email image")
      .sort({ createdAt: -1 });

    const modifiedNotifications = notifications.map((notification) => {
      const isRead = notification.readBy.includes(userId);
      return {
        ...notification.toObject(),
        isRead,
        readBy: undefined,
      };
    });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications: modifiedNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

// Mark a notification as read for a user
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!notification.recipients.includes(userId)) {
      return res.status(403).json({
        message: "You are not authorized to mark this notification as read",
      });
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
    }

    if (notification.readBy.length === notification.recipients.length) {
      await Notification.findByIdAndDelete(notificationId);
      return res
        .status(200)
        .json({ message: "Notification marked as read and deleted" });
    }

    await notification.save();
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({
      recipients: userId,
      readBy: { $ne: userId },
    });

    if (notifications.length === 0) {
      return res
        .status(200)
        .json({ message: "All notifications are already read" });
    }

    await Notification.updateMany(
      { recipients: userId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    await Notification.deleteMany({
      recipients: userId,
      $expr: { $eq: [{ $size: "$readBy" }, { $size: "$recipients" }] },
    });

    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({
      message: "Error marking all notifications as read",
      error: error.message,
    });
  }
};






module.exports = {
  sendNotificationToUsers,
  sendNotificationToAllUsers,
  markNotificationAsRead,
  getNotificationsForUser,
  markAllNotificationsAsRead
};
