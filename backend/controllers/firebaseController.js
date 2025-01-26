const User = require("../models/User");
const sendNotification = require("../services/notificationService");

// send notification to single or multiple users
const sendNotificationToUsers = async (req, res) => {
    const { title, body, deviceTokens } = req.body;
  
    if (!title || !body || (!deviceTokens || (Array.isArray(deviceTokens) && deviceTokens.length === 0))) {
      return res.status(400).json({ message: "Title, body, and at least one deviceToken are required" });
    }

    const tokens = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];
  
    try {
      await sendNotification(title, body, tokens); 
      return res.status(200).json({ message: `Notification sent successfully to ${tokens.length === 1 ? "single user" : "multiple users"}` });
    } catch (error) {
      console.error("Error sending notifications:", error);
      return res.status(500).json({ message: "Error sending notifications", error: error.message });
    }
  };

//send notification to all users
const sendNotificationToAllUsers = async (req, res) => {
    const { title, body } = req.body;
  
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
  
    try {
      const users = await User.find({});
      const deviceTokens = users.map(user => user.deviceToken).filter(token => token); 
  
      if (deviceTokens.length === 0) {
        return res.status(400).json({ message: "No device tokens found" });
      }
  
      await sendNotification(title, body, deviceTokens); 
      return res.status(200).json({ message: "Notifications sent successfully to all users" });
    } catch (error) {
      console.error("Error sending notifications:", error);
      return res.status(500).json({ message: "Error sending notifications", error: error.message });
    }
  };
  

module.exports = {
  sendNotificationToUsers,
  sendNotificationToAllUsers
};
