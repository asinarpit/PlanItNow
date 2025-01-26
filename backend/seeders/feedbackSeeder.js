const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedFeedback = async () => {
  await connectDB();
  try {
    await Feedback.deleteMany();
    console.log("All existing feedback data deleted.");
    
    const events = await Event.find();
    const users = await User.find();

    if (events.length === 0 || users.length === 0) {
      console.log("No events or users found. Please add them first.");
      process.exit();
    }

    const feedbackData = [
      {
        eventId: events[0]._id,
        userId: users[0]._id,
        rating: 5,
        comment: "Amazing event, learned a lot!",
      },
      {
        eventId: events[1]._id,
        userId: users[1]._id,
        rating: 4,
        comment: "Great event, but could have been better organized.",
      },
      {
        eventId: events[2]._id,
        userId: users[2]._id,
        rating: 3,
        comment: "The event was okay, but lacked some key details.",
      },
      {
        eventId: events[3]._id,
        userId: users[1]._id,
        rating: 5,
        comment: "Cultural Fest was a blast!",
      },
      {
        eventId: events[4]._id,
        userId: users[3]._id,
        rating: 4,
        comment: "Sports meet was very engaging and competitive.",
      },
      {
        eventId: events[5]._id,
        userId: users[2]._id,
        rating: 5,
        comment: "Loved the insights on digital marketing!",
      },
      {
        eventId: events[6]._id,
        userId: users[0]._id,
        rating: 4,
        comment: "Great opportunity for startups, well-organized.",
      },
      {
        eventId: events[7]._id,
        userId: users[2]._id,
        rating: 3,
        comment: "Art exhibition was good but could have had more variety.",
      },
      {
        eventId: events[8]._id,
        userId: users[1]._id,
        rating: 5,
        comment: "Yoga retreat was calming and rejuvenating.",
      },
      {
        eventId: events[9]._id,
        userId: users[3]._id,
        rating: 5,
        comment: "Hackathon was thrilling and challenging!",
      },
    ];

    await Feedback.insertMany(feedbackData);

    console.log("Feedback seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding feedback:", error);
    process.exit(1);
  }
};

seedFeedback();
