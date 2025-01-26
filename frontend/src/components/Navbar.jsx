import React from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const dashboardLink = user ?
    (role === "student" ? "/dashboard/student" :
      (role === "admin" ? "/dashboard/admin" :
        "/dashboard/faculty")) : null;

  return (
    <nav className="bg-blue-500 dark:bg-blue-800 text-white dark:text-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold">
          PlanItNow
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
        {user ? (
          <>
            <Link to={dashboardLink} className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 dark:bg-red-700 px-3 py-1 rounded-md hover:bg-red-600 dark:hover:bg-red-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-gray-800 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gray-800 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
