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
        shortDescription: "Learn the latest in tech and innovation.",
        eventType: "Technical",
        department: "CSE",
        date: new Date("2025-05-10T09:00:00Z"),
        endDate: new Date("2025-05-12T18:00:00Z"),
        location: "New York Convention Center",
        virtualEventLink: "https://zoom.us/example-link",
        organizer: {
          name: "Tech Club",
          contactEmail: "techclub@example.com",
          contactPhone: "123-456-7890",
          facultyCoordinator: "Dr. Smith",
          studentCoordinator: "John Doe",
        },
        participants: [users[0]._id, users[1]._id],
        capacity: 500,
        waitlist: [],
        eligibility: "All students",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/401", "https://placehold.co/402"],
        attachments: [
          {
            name: "Event Brochure",
            url: "https://example.com/brochure.pdf",
          },
        ],
        agenda: [
          {
            title: "Opening Keynote",
            description: "Keynote speech by industry leader.",
            startTime: new Date("2025-05-10T09:30:00Z"),
            endTime: new Date("2025-05-10T10:30:00Z"),
            speaker: "Jane Doe",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2025-05-05T23:59:59Z"),
        registrationFee: 20,
        paymentLink: "https://paymentgateway.com/techconf2025",
        socialMedia: {
          facebook: "https://facebook.com/techconf2025",
          instagram: "https://instagram.com/techconf2025",
          twitter: "https://twitter.com/techconf2025",
        },
        targetAudience: "Engineering students",
        prerequisites: "Basic programming knowledge",
        isFeatured: true,
        status: "approved",
        createdBy: users[0]._id,
      },
      {
        title: "Blockchain & Crypto Summit",
        description: "Explore the future of blockchain and cryptocurrency.",
        shortDescription: "Insights into blockchain and crypto trends.",
        eventType: "Technical",
        department: "IT",
        date: new Date("2026-03-10T09:00:00Z"),
        endDate: new Date("2026-03-11T17:00:00Z"),
        location: "Crypto Hub, San Francisco",
        virtualEventLink: "https://cryptosummit2026.com",
        organizer: {
          name: "Blockchain Club",
          contactEmail: "contact@blockchainclub.com",
          contactPhone: "123-456-7890",
          facultyCoordinator: "Dr. John Doe",
          studentCoordinator: "Alice Johnson",
        },
        participants: [users[0]._id, users[3]._id],
        capacity: 400,
        waitlist: [],
        eligibility: "All students",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          { name: "Agenda", url: "https://example.com/agenda.pdf" },
        ],
        agenda: [
          {
            title: "Opening Keynote",
            description: "Introduction to blockchain in 2026",
            startTime: new Date("2026-03-10T09:30:00Z"),
            endTime: new Date("2026-03-10T10:30:00Z"),
            speaker: "Satoshi Nakamoto",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-03-08T23:59:59Z"),
        registrationFee: 50,
        paymentLink: "https://payment.cryptosummit2026.com",
        socialMedia: {
          facebook: "https://facebook.com/cryptosummit",
          instagram: "https://instagram.com/cryptosummit",
          twitter: "https://twitter.com/cryptosummit",
        },
        targetAudience: "Tech Enthusiasts & Developers",
        prerequisites: "Basic understanding of blockchain",
        isFeatured: true,
        status: "approved",
        createdBy: users[1]._id,
      },

      {
        title: "AI & Robotics Conference",
        description: "A deep dive into AI advancements and robotics.",
        shortDescription: "Future of AI and robotics in 2026.",
        eventType: "Technical",
        department: "CSE",
        date: new Date("2026-04-15T10:00:00Z"),
        endDate: new Date("2026-04-16T17:00:00Z"),
        location: "Innovation Center, Boston",
        virtualEventLink: "",
        organizer: {
          name: "AI Society",
          contactEmail: "info@aisociety.com",
          contactPhone: "987-654-3210",
          facultyCoordinator: "Dr. Emily Roberts",
          studentCoordinator: "Mark Williams",
        },
        participants: [users[2]._id, users[4]._id],
        capacity: 600,
        waitlist: [],
        eligibility: "Open to all students and researchers",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Conference Schedule",
            url: "https://example.com/schedule.pdf",
          },
        ],
        agenda: [
          {
            title: "AI in Healthcare",
            description: "How AI is revolutionizing medical diagnostics.",
            startTime: new Date("2026-04-15T11:00:00Z"),
            endTime: new Date("2026-04-15T12:30:00Z"),
            speaker: "Dr. Lisa Chang",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-04-10T23:59:59Z"),
        registrationFee: 100,
        paymentLink: "https://payment.airobotics2026.com",
        socialMedia: {
          facebook: "https://facebook.com/airoboticsconference",
          instagram: "https://instagram.com/airoboticsconference",
          twitter: "https://twitter.com/airoboticsconf",
        },
        targetAudience: "Researchers, Students, AI Enthusiasts",
        prerequisites: "Basic knowledge of AI & Machine Learning",
        isFeatured: false,
        status: "pending",
        createdBy: users[3]._id,
      },

      {
        title: "Cybersecurity Awareness Workshop",
        description:
          "Learn about the latest cybersecurity threats and how to stay safe online.",
        shortDescription: "Stay secure in the digital world.",
        eventType: "Workshop",
        department: "CSE",
        date: new Date("2026-05-12T09:00:00Z"),
        endDate: new Date("2026-05-12T16:00:00Z"),
        location: "Cyber Lab, New York",
        virtualEventLink: "https://cyberawareness2026.com",
        organizer: {
          name: "CyberSec Club",
          contactEmail: "info@cybersecclub.com",
          contactPhone: "555-123-4567",
          facultyCoordinator: "Dr. Alan Turing",
          studentCoordinator: "Sophia Lee",
        },
        participants: [users[1]._id, users[4]._id],
        capacity: 300,
        waitlist: [],
        eligibility: "Open to all students and IT professionals",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Workshop Guide",
            url: "https://example.com/cybersecurity-guide.pdf",
          },
        ],
        agenda: [
          {
            title: "Understanding Cyber Threats",
            description:
              "Exploring the latest cybersecurity risks and countermeasures.",
            startTime: new Date("2026-05-12T09:30:00Z"),
            endTime: new Date("2026-05-12T11:00:00Z"),
            speaker: "Kevin Mitnick",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-05-10T23:59:59Z"),
        registrationFee: 20,
        paymentLink: "https://payment.cyberawareness2026.com",
        socialMedia: {
          facebook: "https://facebook.com/cyberawareness",
          instagram: "https://instagram.com/cyberawareness",
          twitter: "https://twitter.com/cyberawareness",
        },
        targetAudience: "IT Students, Security Enthusiasts",
        prerequisites: "Basic understanding of networks and security",
        isFeatured: true,
        status: "approved",
        createdBy: users[2]._id,
      },

      {
        title: "Game Development Hackathon",
        description: "A 48-hour hackathon to build exciting new games.",
        shortDescription: "Build your own game in 48 hours!",
        eventType: "Technical",
        department: "CSE",
        date: new Date("2026-06-22T10:00:00Z"),
        endDate: new Date("2026-06-24T10:00:00Z"),
        location: "Game Arena, Los Angeles",
        virtualEventLink: "",
        organizer: {
          name: "Game Dev Club",
          contactEmail: "contact@gamedevclub.com",
          contactPhone: "789-654-3210",
          facultyCoordinator: "Dr. Jane Goodall",
          studentCoordinator: "Tom Richardson",
        },
        participants: [users[0]._id, users[3]._id, users[5]._id],
        capacity: 500,
        waitlist: [],
        eligibility: "All students and indie developers",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Hackathon Rules",
            url: "https://example.com/hackathon-rules.pdf",
          },
        ],
        agenda: [
          {
            title: "Kickoff & Theme Announcement",
            description: "Official start of the hackathon with theme reveal.",
            startTime: new Date("2026-06-22T10:00:00Z"),
            endTime: new Date("2026-06-22T11:00:00Z"),
            speaker: "John Carmack",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-06-20T23:59:59Z"),
        registrationFee: 30,
        paymentLink: "https://payment.gamedevhack2026.com",
        socialMedia: {
          facebook: "https://facebook.com/gamedevhackathon",
          instagram: "https://instagram.com/gamedevhackathon",
          twitter: "https://twitter.com/gamedevhack",
        },
        targetAudience: "Game Developers, Programmers, Designers",
        prerequisites: "Basic programming skills",
        isFeatured: false,
        status: "pending",
        createdBy: users[4]._id,
      },

      {
        title: "AI & Machine Learning Bootcamp",
        description:
          "A hands-on bootcamp to dive into AI and machine learning concepts with real-world applications.",
        shortDescription: "Learn AI with hands-on projects!",
        eventType: "Workshop",
        department: "CSE",
        date: new Date("2026-07-15T09:00:00Z"),
        endDate: new Date("2026-07-20T17:00:00Z"),
        location: "Tech Hub, San Francisco",
        virtualEventLink: "https://ai-bootcamp2026.com",
        organizer: {
          name: "AI Research Club",
          contactEmail: "contact@airesearch.com",
          contactPhone: "123-456-7890",
          facultyCoordinator: "Dr. Andrew Ng",
          studentCoordinator: "Emma Watson",
        },
        participants: [users[2]._id, users[5]._id],
        capacity: 100,
        waitlist: [],
        eligibility: "CS students and professionals",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Course Materials",
            url: "https://example.com/ai-course.pdf",
          },
        ],
        agenda: [
          {
            title: "Introduction to AI",
            description:
              "Overview of AI, its applications, and its future impact.",
            startTime: new Date("2026-07-15T09:30:00Z"),
            endTime: new Date("2026-07-15T11:00:00Z"),
            speaker: "Elon Musk",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-07-10T23:59:59Z"),
        registrationFee: 50,
        paymentLink: "https://payment.aibootcamp2026.com",
        socialMedia: {
          facebook: "https://facebook.com/aibootcamp",
          instagram: "https://instagram.com/aibootcamp",
          twitter: "https://twitter.com/aibootcamp",
        },
        targetAudience: "CS Students, AI Enthusiasts",
        prerequisites: "Basic knowledge of Python",
        isFeatured: true,
        status: "approved",
        createdBy: users[3]._id,
      },

      {
        title: "Blockchain & Cryptocurrency Conference",
        description:
          "A global conference discussing blockchain technology, smart contracts, and cryptocurrency trends.",
        shortDescription: "The future of blockchain and crypto.",
        eventType: "Technical",
        department: "IT",
        date: new Date("2026-08-10T10:00:00Z"),
        endDate: new Date("2026-08-12T18:00:00Z"),
        location: "Blockchain Center, Dubai",
        virtualEventLink: "https://blockchainconf2026.com",
        organizer: {
          name: "Blockchain Society",
          contactEmail: "info@blockchainsociety.com",
          contactPhone: "789-123-4567",
          facultyCoordinator: "Dr. Vitalik Buterin",
          studentCoordinator: "Alice Johnson",
        },
        participants: [users[0]._id, users[1]._id, users[3]._id],
        capacity: 500,
        waitlist: [],
        eligibility: "Open to all finance & tech professionals",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Conference Schedule",
            url: "https://example.com/blockchain-schedule.pdf",
          },
        ],
        agenda: [
          {
            title: "Future of Smart Contracts",
            description:
              "Discussion on how smart contracts will transform industries.",
            startTime: new Date("2026-08-10T11:00:00Z"),
            endTime: new Date("2026-08-10T12:30:00Z"),
            speaker: "Satoshi Nakamoto",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-08-05T23:59:59Z"),
        registrationFee: 100,
        paymentLink: "https://payment.blockchainconf2026.com",
        socialMedia: {
          facebook: "https://facebook.com/blockchainconference",
          instagram: "https://instagram.com/blockchainconference",
          twitter: "https://twitter.com/blockchainconf",
        },
        targetAudience: "Finance, Tech Professionals, Investors",
        prerequisites: "Basic understanding of blockchain",
        isFeatured: false,
        status: "pending",
        createdBy: users[5]._id,
      },

      {
        title: "Cybersecurity & Ethical Hacking Workshop",
        description:
          "An interactive workshop covering the latest trends in cybersecurity and ethical hacking techniques.",
        shortDescription: "Master ethical hacking and security skills!",
        eventType: "Workshop",
        department: "CSE",
        date: new Date("2026-09-05T09:00:00Z"),
        endDate: new Date("2026-09-07T17:00:00Z"),
        location: "Cyber Lab, New York",
        virtualEventLink: "https://cyberworkshop2026.com",
        organizer: {
          name: "Cybersecurity Club",
          contactEmail: "contact@cybersec.com",
          contactPhone: "987-654-3210",
          facultyCoordinator: "Dr. Kevin Mitnick",
          studentCoordinator: "John Doe",
        },
        participants: [users[4]._id, users[5]._id, users[6]._id],
        capacity: 200,
        waitlist: [],
        eligibility: "IT students, security professionals",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Workshop Guide",
            url: "https://example.com/cyber-guide.pdf",
          },
        ],
        agenda: [
          {
            title: "Penetration Testing 101",
            description:
              "Learn the basics of penetration testing and ethical hacking tools.",
            startTime: new Date("2026-09-05T10:00:00Z"),
            endTime: new Date("2026-09-05T12:00:00Z"),
            speaker: "Edward Snowden",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-08-30T23:59:59Z"),
        registrationFee: 75,
        paymentLink: "https://payment.cyberworkshop2026.com",
        socialMedia: {
          facebook: "https://facebook.com/cyberworkshop",
          instagram: "https://instagram.com/cyberworkshop",
          twitter: "https://twitter.com/cyberworkshop",
        },
        targetAudience: "Security enthusiasts, IT students",
        prerequisites: "Basic knowledge of networking",
        isFeatured: true,
        status: "approved",
        createdBy: users[2]._id,
      },

      {
        title: "Startup Pitch Competition",
        description:
          "A thrilling competition where budding entrepreneurs pitch their startup ideas to investors.",
        shortDescription: "Pitch your startup and win funding!",
        eventType: "Other",
        department: "ECE",
        date: new Date("2026-10-15T10:00:00Z"),
        endDate: new Date("2026-10-15T18:00:00Z"),
        location: "Innovation Hub, Silicon Valley",
        virtualEventLink: "https://startuppitch2026.com",
        organizer: {
          name: "Startup Incubator",
          contactEmail: "info@startupincubator.com",
          contactPhone: "555-789-1234",
          facultyCoordinator: "Dr. Peter Thiel",
          studentCoordinator: "Sophia Lee",
        },
        participants: [users[1]._id, users[3]._id, users[6]._id],
        capacity: 50,
        waitlist: [],
        eligibility: "Aspiring entrepreneurs, startup founders",
        image: "https://placehold.co/400",
        gallery: ["https://placehold.co/400", "https://placehold.co/500"],
        attachments: [
          {
            name: "Pitch Deck Guidelines",
            url: "https://example.com/pitch-guidelines.pdf",
          },
        ],
        agenda: [
          {
            title: "Investor Panel & Pitching",
            description: "Startups pitch their ideas to a panel of investors.",
            startTime: new Date("2026-10-15T14:00:00Z"),
            endTime: new Date("2026-10-15T16:00:00Z"),
            speaker: "Mark Cuban",
          },
        ],
        registrationRequired: true,
        registrationDeadline: new Date("2026-10-10T23:59:59Z"),
        registrationFee: 30,
        paymentLink: "https://payment.startuppitch2026.com",
        socialMedia: {
          facebook: "https://facebook.com/startuppitch",
          instagram: "https://instagram.com/startuppitch",
          twitter: "https://twitter.com/startuppitch",
        },
        targetAudience: "Entrepreneurs, Investors",
        prerequisites: "Business idea, Pitch deck",
        isFeatured: false,
        status: "pending",
        createdBy: users[4]._id,
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
