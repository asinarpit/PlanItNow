import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

const Sidebar = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="w-64 bg-white dark:bg-gray-900 h-screen border-r dark:border-gray-700 flex flex-col sticky top-0 p-4">
      <Link to="/">
        <h2 className="text-2xl whitespace-nowrap pb-5 border-b dark:border-gray-700">
          Plan<span className="font-bold text-teal-600">It</span>Now
        </h2>
      </Link>
      <nav className="flex flex-col py-4 space-y-4">

        {/* Common for All Roles */}
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

        {/* Admin Routes */}
        {role === "admin" && (
          <>
            <NavLink
              to="/dashboard/admin/events"
              className={({ isActive }) =>
                `p-2 rounded-sm flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <FaCalendarAlt className="text-lg" />
              <span>Event Management</span>
            </NavLink>

            <NavLink
              to="/dashboard/admin/users"
              className={({ isActive }) =>
                `p-2 rounded flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <FaUsers className="text-lg" />
              <span>Users Management</span>
            </NavLink>

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
          </>
        )}

        {/* Faculty Routes */}
        {role === "faculty" && (
          <>
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

            <NavLink
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
            </NavLink>
          </>
        )}

        {/* Student Routes */}
        {role === "student" && (
          <>
            <NavLink
              to="/dashboard/student/events"
              className={({ isActive }) =>
                `p-2 rounded-sm flex items-center space-x-2 ${isActive ? "bg-teal-600 text-gray-100" : "hover:text-teal-600"
                }`
              }
            >
              <FaCalendarAlt className="text-lg" />
              <span>View Events</span>
            </NavLink>

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
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
