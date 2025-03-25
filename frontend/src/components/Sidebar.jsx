import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdPayments } from "react-icons/md";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";


const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 },
};

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useSelector((state) => state.auth.user);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <motion.div
      className="fixed lg:sticky lg:top-0 lg:left-0 w-64 bg-white dark:bg-gray-900 h-screen border-r dark:border-gray-700 flex flex-col p-4 z-50"
      initial={false}
      animate={isDesktop ? "open" : isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "tween", duration: 0.3 }}>
      <Link to="/">
        <h2 className="text-2xl whitespace-nowrap pb-5 border-b dark:border-gray-700">
          Plan<span className="font-bold text-teal-600">It</span>Now
        </h2>
      </Link>
      <motion.nav
        className="flex flex-col py-4 space-y-4"
        variants={{
          open: {
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
          },
          closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
          }
        }}
      >

        {/* Common for All Roles */}
        <motion.div variants={itemVariants} onClick={onClose}>
          <NavLink
            to={`/`}
            end
            className={({ isActive }) =>
              `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
              }`
            }
          >
            <FaHome className="text-lg" />
            <span>Home</span>
          </NavLink>
        </motion.div>
        <motion.div variants={itemVariants} onClick={onClose}>
          <NavLink
            to={`/dashboard/${role}`}
            end
            className={({ isActive }) =>
              `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
              }`
            }
          >
            <FaTachometerAlt className="text-lg" />
            <span>Dashboard Overview</span>
          </NavLink>
        </motion.div>

        {/* Admin Routes */}
        {role === "admin" && (
          <>
            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/admin/events"
                className={({ isActive }) =>
                  `p-2 rounded-sm flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <FaCalendarAlt className="text-lg" />
                <span>Events</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/admin/users"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <FaUsers className="text-lg" />
                <span>Users</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/admin/notifications"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <IoIosNotifications className="text-lg" />
                <span>Notifications</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/admin/payments"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <MdPayments className="text-lg" />
                <span>Payments</span>
              </NavLink>
            </motion.div>
          </>
        )}

        {/* Faculty Routes */}
        {role === "faculty" && (
          <>
            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/faculty/my-events"
                className={({ isActive }) =>
                  `p-2 rounded-sm flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <FaCalendarAlt className="text-lg" />
                <span>My Events</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/faculty/notifications"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <IoIosNotifications className="text-lg" />
                <span>Notifications</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/faculty/payments"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <MdPayments className="text-lg" />
                <span>Payments</span>
              </NavLink>
            </motion.div>

            {/* <NavLink
              to="/dashboard/faculty/participants"
              className={({ isActive }) =>
                `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <FaUsers className="text-lg" />
              <span>Participants</span>
            </NavLink>

            <NavLink
              to="/dashboard/faculty/feedback"
              className={({ isActive }) =>
                `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <IoIosNotifications className="text-lg" />
              <span>Feedback</span>
            </NavLink> */}
          </>
        )}

        {/* Student Routes */}
        {role === "student" && (
          <>
            {/* <NavLink
              to="/dashboard/student/events"
              className={({ isActive }) =>
                `p-2 rounded-sm flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <FaCalendarAlt className="text-lg" />
              <span>View Events</span>
            </NavLink> */}

            <motion.div variants={itemVariants} onClick={onClose}>

              <NavLink
                to="/dashboard/student/registered-events"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <FaUsers className="text-lg" />
                <span>Registered Events</span>
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} onClick={onClose}>
              <NavLink
                to="/dashboard/student/notifications"
                className={({ isActive }) =>
                  `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                  }`
                }
              >
                <IoIosNotifications className="text-lg" />
                <span>Notifications</span>
              </NavLink>
            </motion.div>
          </>
        )}
      </motion.nav>
    </motion.div>
  );
};

export default Sidebar;
