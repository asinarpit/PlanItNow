// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import DashboardOverview from "./components/DashboardOverview";
import UsersTable from "./components/UsersTable";
import EventManagement from "./components/EventManagement";
import FeedbackTable from "./components/FeedbackTable";
import ParticipantsTable from "./components/ParticipantsTable";
import { setDeviceToken, logout } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import { getDeviceToken } from "./utils/firebaseUtils";
import NotificationToast from "./components/NotificationToast";
import Notifications from "./components/Notifications";
import DashboardLayout from "./components/DashboardLayout";
import axios from "axios";
import { SkeletonTheme } from "react-loading-skeleton";
import MyEvents from "./components/MyEvents";


const App = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const baseColor = theme === "dark" ? "#374151" : "#E5E7EB";
  const highlightColor = theme === "dark" ? "#4B5563" : "#F3F4F6";


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const fetchDeviceToken = async () => {
      const token = await getDeviceToken();
      if (token) {
        dispatch(setDeviceToken(token));
      }
    };

    fetchDeviceToken();
  }, [dispatch]);

  // to logout if status is 401 (token expiration)
  useEffect(() => {
    const setupAxiosInterceptor = () => {
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            dispatch(logout());
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptor();

    return () => {
      axios.interceptors.response.eject();
    };
  }, [dispatch]);

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <Router>
        <Toaster position="top-right" />
        <NotificationToast />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="users" element={<UsersTable />} />
              <Route path="notifications" element={<Notifications />} />

              {/* Nested Routes for Event Management */}
              <Route path="events/feedback/:eventId" element={<FeedbackTable />} />
              <Route path="events/participants/:eventId" element={<ParticipantsTable />} />
            </Route>
          </Route>

          {/* Protected Routes for Faculty */}
          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/dashboard/faculty" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="my-events" element={<MyEvents />} />
            </Route>

          </Route>

          {/* Protected Routes for Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard/student" element={<DashboardLayout />}>
              {/* Add student-specific routes here */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </SkeletonTheme>
  );
};

export default App;
