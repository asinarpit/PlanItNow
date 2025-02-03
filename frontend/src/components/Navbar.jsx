import React from "react";
import { Link, useNavigate, NavLink } from "react-router";
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
    <nav className="sticky top-0 w-full z-50 bg-white dark:bg-gray-900 px-4 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-semibold">
          Plan<span className="font-bold text-teal-600">It</span>Now
        </Link>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-teal-600 font-semibold" : "hover:text-teal-600"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-teal-600 font-semibold" : "hover:text-teal-600"
          }
        >
          About
        </NavLink>
        {user && (
          <NavLink
            to={dashboardLink}
            className={({ isActive }) =>
              isActive ? "text-teal-600 font-semibold" : "hover:text-teal-600"
            }
          >
            Dashboard
          </NavLink>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 dark:bg-red-700 px-3 py-1 rounded-md hover:bg-red-600 dark:hover:bg-red-800 text-gray-100"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-teal-600 font-semibold text-gray-100 px-3 py-1 rounded-md hover:bg-teal-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="border text-teal-600 font-semibold border-teal-600 px-3 py-1 rounded-md hover:bg-teal-600 hover:text-white"
            >
              Sign Up
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
