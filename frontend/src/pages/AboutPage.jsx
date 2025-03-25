import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiStar, FiThumbsUp, FiArrowUpRight } from "react-icons/fi";
import TeamMemberCard from "../components/TeamMemberCard";
import { useState } from "react";

const AboutPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <FiCalendar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Event Planning",
      description: "Easily create and manage events with our intuitive interface",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: <FiUsers className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Collaboration",
      description: "Work together with team members in real-time",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <FiStar className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Customization",
      description: "Tailor the platform to your institution's needs",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  const team = [
    {
      name: "Arpit Singh",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about creating efficient solutions",
      avatar: "https://cdn-icons-png.flaticon.com/256/4825/4825038.png",
      socials: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Jane Smith",
      role: "UI Designer",
      bio: "Creating beautiful and user-friendly interfaces",
      avatar: "https://cdn-icons-png.flaticon.com/256/4825/4825087.png",
      socials: {
        github: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex justify-center items-center overflow-hidden"
      >

        <div className="max-w-7xl mt-4 md:mt-0 mx-auto relative px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-8 inline-block bg-gradient-to-r from-teal-600 to-cyan-500 p-1 rounded-full"
            >
              <div className="bg-white dark:bg-gray-900 px-6 py-2 rounded-full text-sm font-semibold text-teal-600 dark:text-teal-400">
                About PlanItNow
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 dark:text-white bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Revolutionizing Event Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering educational institutions with next-generation tools for seamless event organization,
              collaboration, and student engagement.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            {/* Replace with your actual illustration path */}
            <img
              src="/event-management.png"
              alt="Event Management Illustration"
              className="w-full max-w-lg h-auto"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-10 md:py-24 px-4 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Our Vision for the Future
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              We envision a world where educational institutions can focus on what really matters -
              fostering growth and innovation - while we handle the complexities of event management.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              {[500, 95, 4.8].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  className="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-lg"
                >
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {stat}{index === 2 && <span className="text-xl">/5</span>}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {index === 0 ? 'Institutions' : index === 1 ? 'Satisfaction' : 'Average Rating'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-96 rounded-3xl overflow-hidden"
          >
            <img src="/calendar.png" className="w-full h-full object-contain" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block mb-4 text-teal-600 dark:text-teal-400 text-sm md:text-base font-semibold"
            >
              Why Choose Us?
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-bold dark:text-white mb-6">
              Features That Make the Difference
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <div className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-2xl opacity-20 blur transition-all duration-300 group-hover:opacity-40`} />
                <div className="relative h-full text-center md:text-left p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className={`mb-4 lg:mb-6 inline-block p-4 rounded-lg bg-gradient-to-br ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                  <div className="mt-4 md:mt-6 flex items-center justify-center md:justify-start text-teal-600 dark:text-teal-400 font-medium">
                    Learn More
                    <FiArrowUpRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block mb-4 text-teal-600 dark:text-teal-400 text-sm md:text-base font-semibold"
            >
              Meet the Team
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-bold dark:text-white mb-6">
              The Minds Behind PlanItNow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            className="relative bg-gradient-to-br from-teal-600 to-cyan-500 text-white p-5 md:p-12 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="text-center relative z-10">
              <FiThumbsUp className="w-16 h-16 mx-auto mb-8 animate-bounce" />
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Event Management?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of institutions already using PlanItNow
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto hover:gap-3"
              >
                Get Started Now
                <FiArrowUpRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;