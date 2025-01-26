const User = require("../models/User");
const Event = require("../models/Event");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalEvents = await Event.countDocuments();

    const totalParticipants = await Event.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const pendingEvents = await Event.countDocuments({ status: "pending" });

    const approvedEvents = await Event.countDocuments({ status: "approved" });

    const registeredUsers = await User.countDocuments({
      email: { $ne: null },
      password: { $ne: null },
    });

    const upcomingEventsCount = await Event.countDocuments({
        date: { $gt: new Date() }
      });

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalParticipants: totalParticipants[0]?.count || 0,
      eventsByCategory,
      pendingEvents,
      approvedEvents,
      registeredUsers,
      upcomingEventsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
