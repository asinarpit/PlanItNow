const mongoose = require("mongoose");
const User = require("../models/User");
const Event = require("../models/Event");

// Helper function to parse aggregation results
const getFirstAggregationValue = (aggregationResult, field) =>
  aggregationResult[0]?.[field] || 0;

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalParticipants,
      eventsByType,
      eventsByDepartment,
      pendingEvents,
      approvedEvents,
      registeredUsers,
      upcomingEventsCount,
      cancelledEvents,
      rejectedEvents,
      featuredEventsCount,
      virtualEventsCount,
      totalWaitlisted,
      feesSummary,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Event.aggregate([
        { $unwind: "$participants" },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      Event.aggregate([{ $group: { _id: "$eventType", count: { $sum: 1 } } }]),
      Event.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]),
      Event.countDocuments({ status: "pending" }),
      Event.countDocuments({ status: "approved" }),
      User.countDocuments({ email: { $ne: null }, password: { $ne: null } }),
      Event.countDocuments({ date: { $gt: new Date() } }),
      Event.countDocuments({ status: "cancelled" }),
      Event.countDocuments({ status: "rejected" }),
      Event.countDocuments({ isFeatured: true }),
      Event.countDocuments({ virtualEventLink: { $exists: true, $ne: null } }),
      Event.aggregate([
        { $unwind: "$waitlist" },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        {
          $group: {
            _id: null,
            totalFees: { $sum: "$registrationFee" },
            paidEventsCount: {
              $sum: { $cond: [{ $gt: ["$registrationFee", 0] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalParticipants: getFirstAggregationValue(totalParticipants, "count"),
      eventsByType,
      eventsByDepartment,
      pendingEvents,
      approvedEvents,
      registeredUsers,
      upcomingEventsCount,
      cancelledEvents,
      rejectedEvents,
      featuredEventsCount,
      virtualEventsCount,
      waitlistedParticipants: getFirstAggregationValue(
        totalWaitlisted,
        "count"
      ),
      totalRegistrationFees: getFirstAggregationValue(feesSummary, "totalFees"),
      paidEventsCount: getFirstAggregationValue(feesSummary, "paidEventsCount"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFacultyDashboardStats = async (req, res) => {
  try {
    const facultyId = new mongoose.Types.ObjectId(req.user.id);

    const [
      totalEventsCreated,
      participantsAgg,
      eventsByType,
      waitlistedAgg,
      revenueAgg,
      upcomingEvents,
      pendingApprovals,
      approvedEvents,
      registrationsAgg,
    ] = await Promise.all([
      Event.countDocuments({ createdBy: facultyId }),
      Event.aggregate([
        { $match: { createdBy: facultyId } },
        { $unwind: "$participants" },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        { $match: { createdBy: facultyId } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        { $match: { createdBy: facultyId } },
        { $unwind: "$waitlist" },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      Event.aggregate([
        { $match: { createdBy: facultyId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$registrationFee" },
            avgParticipants: { $avg: { $size: "$participants" } },
          },
        },
      ]),
      Event.countDocuments({ createdBy: facultyId, date: { $gt: new Date() } }),
      Event.countDocuments({ createdBy: facultyId, status: "pending" }),
      Event.countDocuments({ createdBy: facultyId, status: "approved" }),
      Event.aggregate([
        { $match: { createdBy: facultyId } },
        { $unwind: "$participants" },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      totalEventsCreated,
      totalParticipants: getFirstAggregationValue(participantsAgg, "count"),
      upcomingEvents,
      pendingApprovals,
      approvedEvents,
      totalRegistrations: getFirstAggregationValue(registrationsAgg, "count"),
      eventsByTypeCreated: eventsByType,
      waitlistedParticipants: getFirstAggregationValue(waitlistedAgg, "count"),
      totalRevenue: getFirstAggregationValue(revenueAgg, "totalRevenue"),
      avgParticipants: Number(
        (getFirstAggregationValue(revenueAgg, "avgParticipants") || 0).toFixed(
          1
        )
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    const [
      totalEventsParticipated,
      upcomingEvents,
      pastEvents,
      pendingRegistrations,
      waitlistedCount,
      feeSummary,
      eventsByCategory,
    ] = await Promise.all([
      Event.countDocuments({ participants: studentId }),
      Event.countDocuments({
        participants: studentId,
        date: { $gt: new Date() },
      }),
      Event.countDocuments({
        participants: studentId,
        date: { $lt: new Date() },
      }),
      Event.countDocuments({ participants: studentId, status: "pending" }),
      Event.countDocuments({ waitlist: studentId }),
      Event.aggregate([
        { $match: { participants: studentId } },
        {
          $group: {
            _id: null,
            totalPaid: { $sum: "$registrationFee" },
            paidEventsCount: {
              $sum: { $cond: [{ $gt: ["$registrationFee", 0] }, 1, 0] },
            },
          },
        },
      ]),
      Event.aggregate([
        { $match: { participants: studentId } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      totalEventsParticipated,
      upcomingEvents,
      pastEvents,
      pendingRegistrations,
      waitlistedCount,
      totalFeesPaid: getFirstAggregationValue(feeSummary, "totalPaid"),
      paidEventsCount: getFirstAggregationValue(feeSummary, "paidEventsCount"),
      eventsByCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
