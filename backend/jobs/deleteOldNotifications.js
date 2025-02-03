const cron = require("node-cron");
const Notification = require("../models/Notification");

// Delete 1 week old notifications
cron.schedule("0 0 * * *", async () => {
  console.log("Cron job started: Deleting notifications older than one week.");

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await Notification.deleteMany({
      createdAt: { $lt: oneWeekAgo },
    });
    console.log(
      `Deleted ${result.deletedCount} notifications older than one week.`
    );
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }

  console.log("Cron job completed.");
});
