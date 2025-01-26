const connectDB = require("../config/db");
const Event = require("../models/Event");
const User = require("../models/User");

const seedEvents = async () => {
  await connectDB();
  try {
    await Event.deleteMany();
    console.log("All existing event data deleted.");

    const users = await User.find();

    if (users.length === 0) {
      console.log("No users found. Please add users first.");
      process.exit();
    }

    const eventData = [
      {
        title: "Tech Conference 2025",
        description:
          "An event to learn the latest in technology and innovation.",
        date: new Date("2025-05-10T09:00:00Z"),
        participants: [users[0]._id, users[1]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[0]._id,
        location: "New York Convention Center",
        category: "Workshop",
        capacity: 500,
        isFeatured:false
      },
      {
        title: "Web Development Workshop",
        description: "A hands-on workshop for aspiring web developers.",
        date: new Date("2025-06-15T10:00:00Z"),
        participants: [users[2]._id],
        image: "https://placehold.co/400",
        status: "pending",
        createdBy: users[1]._id,
        location: "San Francisco Tech Hub",
        category: "Seminar",
        capacity: 100,
        isFeatured:true
      },
      {
        title: "AI & Machine Learning Seminar",
        description:
          "A seminar discussing the future of AI and machine learning.",
        date: new Date("2025-07-20T11:00:00Z"),
        participants: [users[1]._id, users[2]._id],
        image: "https://placehold.co/400",
        status: "rejected",
        createdBy: users[2]._id,
        location: "Boston Innovation Center",
        category: "Seminar",
        capacity: 300,
        isFeatured:false
      },
      {
        title: "Cultural Fest 2025",
        description:
          "A celebration of diverse cultures through music, dance, and food.",
        date: new Date("2025-08-15T17:00:00Z"),
        participants: [users[0]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[1]._id,
        location: "Central Park, NYC",
        category: "Cultural",
        capacity: 1000,
        isFeatured:true
      },
      {
        title: "Annual Sports Meet",
        description:
          "An event for sports enthusiasts to showcase their skills.",
        date: new Date("2025-09-10T08:00:00Z"),
        participants: [users[1]._id, users[3]._id],
        image: "https://placehold.co/400",
        status: "pending",
        createdBy: users[2]._id,
        location: "Olympic Stadium, LA",
        category: "Sports",
        capacity: 200,
        isFeatured:true
      },
      {
        title: "Digital Marketing Masterclass",
        description:
          "Learn the art of digital marketing from industry experts.",
        date: new Date("2025-10-05T09:30:00Z"),
        participants: [users[2]._id, users[3]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[0]._id,
        location: "Seattle Tech Arena",
        category: "Workshop",
        capacity: 150,
        isFeatured:false
      },
      {
        title: "Startup Pitch Fest",
        description:
          "A platform for startups to pitch their ideas to investors.",
        date: new Date("2025-11-20T13:00:00Z"),
        participants: [users[1]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[1]._id,
        location: "Silicon Valley Conference Center",
        category: "Seminar",
        capacity: 250,
        isFeatured:true
      },
      {
        title: "Art Exhibition 2025",
        description: "A display of artwork from renowned and upcoming artists.",
        date: new Date("2025-12-10T10:00:00Z"),
        participants: [users[0]._id, users[2]._id],
        image: "https://placehold.co/400",
        status: "pending",
        createdBy: users[2]._id,
        location: "Art Gallery, Chicago",
        category: "Cultural",
        capacity: 300,
        isFeatured:false
      },
      {
        title: "Yoga and Wellness Retreat",
        description:
          "A retreat to rejuvenate your mind and body through yoga and meditation.",
        date: new Date("2026-01-15T06:00:00Z"),
        participants: [users[1]._id, users[3]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[0]._id,
        location: "Mountain Retreat Center, Denver",
        category: "Workshop",
        capacity: 50,
        isFeatured:true
      },
      {
        title: "Coding Hackathon 2026",
        description:
          "An intense 24-hour hackathon to solve real-world problems.",
        date: new Date("2026-02-25T10:00:00Z"),
        participants: [users[2]._id],
        image: "https://placehold.co/400",
        status: "approved",
        createdBy: users[1]._id,
        location: "Tech Valley HQ, Austin",
        category: "Sports",
        capacity: 500,
        isFeatured:false
      },
    ];

    await Event.insertMany(eventData);

    console.log("Events seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
};

seedEvents();
