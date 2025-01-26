// /services/notificationService.js
const admin = require("../config/firebase");

const sendNotification = async (title, body, deviceTokens) => {
  const message = {
    notification: {
      title,
      body,
    },
    tokens: deviceTokens, 
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notifications sent:", response.successCount);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

module.exports = sendNotification;
