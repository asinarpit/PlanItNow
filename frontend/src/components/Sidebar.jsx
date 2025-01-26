import { NavLink } from "react-router"; 
import { FaTachometerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";  

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col sticky top-0 -ml-4">
      <h2 className="text-2xl font-bold p-4 whitespace-nowrap">Admin Dashboard</h2>
      <nav className="flex flex-col p-4 space-y-4">
        <NavLink
          to="/dashboard/admin"
          end
          className={({ isActive }) =>
            `p-2 rounded flex items-center space-x-2 ${
              isActive ? "bg-gray-700 text-yellow-300" : "hover:bg-gray-700"
            }`
          }
        >
          <FaTachometerAlt className="text-xl" />
          <span>Dashboard Overview</span>
        </NavLink>
        <NavLink
          to="/dashboard/admin/events"
          className={({ isActive }) =>
            `p-2 rounded flex items-center space-x-2 ${
              isActive ? "bg-gray-700 text-yellow-300" : "hover:bg-gray-700"
            }`
          }
        >
          <FaCalendarAlt className="text-xl" />
          <span>Event Management</span>
        </NavLink>
        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            `p-2 rounded flex items-center space-x-2 ${
              isActive ? "bg-gray-700 text-yellow-300" : "hover:bg-gray-700"
            }`
          }
        >
          <FaUsers className="text-xl" />
          <span>Users Management</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
