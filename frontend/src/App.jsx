import React, { useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import { setDeviceToken, logout } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import { getDeviceToken } from "./utils/firebaseUtils";
import NotificationToast from "./components/NotificationToast";
import DashboardLayout from "./components/DashboardLayout";
import axios from "axios";
import { SkeletonTheme } from "react-loading-skeleton";
import AdminDashboardOverviewPage from "./pages/AdminDashboardOverviewPage";
import EventManagementPage from "./pages/EventManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyEventsPage from "./pages/MyEventsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import FeedbacksPage from "./pages/FeedbacksPage";
import EventFormPage from "./pages/EventFormPage";
import FacultyDashboardOverviewPage from "./pages/FacultyDashboardOverviewPage";
import StudentDashboardOverviewPage from "./pages/StudentDashboardOverviewPage";
import { useTheme } from "./contexts/ThemeContext.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import AdminEventDetailPage from "./pages/AdminEventDetailPage.jsx";
import MyProfile from "./pages/ProfilePage.jsx";
import RegisteredEventsPage from "./pages/RegisteredEventsPage.jsx";


const App = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const baseColor = theme === "dark" ? "#374151" : "#E5E7EB";
  const highlightColor = theme === "dark" ? "#4B5563" : "#F3F4F6";

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
        <Toaster position="top-right" toastOptions={{
          style: {
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }} />
        <NotificationToast />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
          </Route>

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboardOverviewPage />} />
              <Route path="events" element={<EventManagementPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="my-profile" element={<MyProfile/>}/>
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Nested Routes for Event Management */}
              <Route path="events/feedback/:eventId" element={<FeedbacksPage />} />
              <Route path="events/participants/:eventId" element={<ParticipantsPage />} />
              <Route path="events/new" element={<EventFormPage />} />
              <Route path="events/edit/:eventId" element={<EventFormPage />} />
              <Route path="events/:eventId" element={<AdminEventDetailPage/>}/>
              
            </Route>
          </Route>

          {/* Protected Routes for Faculty */}
          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/dashboard/faculty" element={<DashboardLayout />}>
              <Route index element={<FacultyDashboardOverviewPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="my-events" element={<MyEventsPage />} />
              <Route path="my-events/new" element={<EventFormPage />} />
              <Route path="my-events/edit/:eventId" element={<EventFormPage />} />
              <Route path="my-events/participants/:eventId" element={<ParticipantsPage />} />
              <Route path="my-events/feedback/:eventId" element={<FeedbacksPage />} />

            </Route>

          </Route>

          {/* Protected Routes for Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/dashboard/student" element={<DashboardLayout />}>
              <Route index element={<StudentDashboardOverviewPage />} />
              <Route path="registered-events" element={<RegisteredEventsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

            </Route>
          </Route>
        </Routes>
      </Router>
    </SkeletonTheme>


  );
};

export default App;
