import { motion } from "framer-motion";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const TeamMemberCard = ({ member }) => {
  return (
    <div className="flex items-center bg-white dark:bg-gray-700 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <img 
        src={member.avatar} 
        alt={member.name} 
        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mr-6 border-4 border-teal-500 flex-shrink-0"
      />
      <div>
        <h3 className="text-xl font-bold mb-1 dark:text-white">{member.name}</h3>
        <p className="text-teal-600 dark:text-teal-400 mb-2">{member.role}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
        <div className="flex gap-4">
          <motion.a 
            whileHover={{ scale: 1.1 }}
            href="#" 
            className="text-gray-600 dark:text-gray-300 hover:text-teal-600"
          >
            <FiGithub className="w-6 h-6" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-teal-600"
          >
            <FiLinkedin className="w-6 h-6" />
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;