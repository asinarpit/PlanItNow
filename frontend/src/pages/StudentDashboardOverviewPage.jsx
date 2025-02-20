import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentDashboardOverviewPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({
    pastEvents: 0,
    pendingRegistrations: 0,
    totalEventsParticipated: 0,
    upcomingEvents: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        setLoading(true);
        const response = await axios.get(`${BASE_URL}/dashboard/stats/student`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview({
          pastEvents: response.data.pastEvents,
          pendingRegistrations: response.data.pendingRegistrations,
          totalEventsParticipated: response.data.totalEventsParticipated,
          upcomingEvents: response.data.upcomingEvents,
        });
      } catch (err) {
        setError("Failed to fetch dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) return (
    <div className="grid grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="60%" className="mt-4" />
        </div>
      ))}
    </div>
  );

  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-teal-600 text-gray-100 p-6 rounded-lg shadow dark:bg-gray-900">
        <h3 className="text-lg font-semibold">Past Events</h3>
        <p className="text-2xl">{overview.pastEvents}</p>
      </div>
      <div className="bg-teal-600 text-gray-100 p-6 rounded-lg shadow dark:bg-gray-900">
        <h3 className="text-lg font-semibold">Pending Registrations</h3>
        <p className="text-2xl">{overview.pendingRegistrations}</p>
      </div>
      <div className="bg-teal-600 text-gray-100 p-6 rounded-lg shadow dark:bg-gray-900">
        <h3 className="text-lg font-semibold">Total Events Participated</h3>
        <p className="text-2xl">{overview.totalEventsParticipated}</p>
      </div>
      <div className="bg-teal-600 text-gray-100 p-6 rounded-lg shadow dark:bg-gray-900">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <p className="text-2xl">{overview.upcomingEvents}</p>
      </div>
    </div>
  );
};

export default StudentDashboardOverviewPage;
