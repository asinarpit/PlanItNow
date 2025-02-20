const User = require("../models/User");
const Event = require("../models/Event");

exports.getAdminDashboardStats = async (req, res) => {
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

exports.getFacultyDashboardStats = async (req, res) => {
  try {
    const facultyId = req.user.id; 

    const totalEventsCreated = await Event.countDocuments({ createdBy: facultyId });

    const totalParticipants = await Event.aggregate([
      { $match: { createdBy: facultyId } },
      { $unwind: "$participants" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const upcomingEvents = await Event.countDocuments({
      createdBy: facultyId,
      date: { $gt: new Date() },
    });

    const pendingApprovals = await Event.countDocuments({
      createdBy: facultyId,
      status: "pending",
    });

    const approvedEvents = await Event.countDocuments({
      createdBy: facultyId,
      status: "approved",
    });

    const totalRegistrations = await Event.aggregate([
      { $match: { createdBy: facultyId } },
      { $unwind: "$participants" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalEventsCreated,
      totalParticipants: totalParticipants[0]?.count || 0,
      upcomingEvents,
      pendingApprovals,
      approvedEvents,
      totalRegistrations: totalRegistrations[0]?.count || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id; 

    const totalEventsParticipated = await Event.countDocuments({
      participants: studentId,
    });

    const upcomingEvents = await Event.countDocuments({
      participants: studentId,
      date: { $gt: new Date() },
    });

    const pastEvents = await Event.countDocuments({
      participants: studentId,
      date: { $lt: new Date() },
    });

    const pendingRegistrations = await Event.countDocuments({
      participants: studentId,
      status: "pending",
    });

    res.status(200).json({
      totalEventsParticipated,
      upcomingEvents,
      pastEvents,
      pendingRegistrations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
