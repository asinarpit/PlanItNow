import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import toast, { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import DashboardOverview from "./components/DashboardOverview";
import UsersTable from "./components/UsersTable";
import EventManagement from "./components/EventManagement";
import FeedbackTable from "./components/FeedbackTable";
import ParticipantsTable from "./components/ParticipantsTable";
import { setDeviceToken } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import { getDeviceToken } from "./utils/firebaseUtils";
import NotificationToast from "./components/NotificationToast";

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDeviceToken = async () => {
      const token = await getDeviceToken();
      if (token) {
        dispatch(setDeviceToken(token)); 
      }
    };

    fetchDeviceToken();
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" />
      <NotificationToast/>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="users" element={<UsersTable />} />

              {/* Nested Routes for Event Management */}
              <Route path="events/feedback/:eventId" element={<FeedbackTable />} />
              <Route path="events/participants/:eventId" element={<ParticipantsTable />} />
            </Route>
          </Route>

          {/* Protected Routes for Faculty */}
          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          </Route>

          {/* Protected Routes for Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
