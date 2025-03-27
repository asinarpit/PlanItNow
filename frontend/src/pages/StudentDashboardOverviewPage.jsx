import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentDashboardOverviewPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({
    pastEvents: 0,
    pendingRegistrations: 0,
    totalEventsParticipated: 0,
    upcomingEvents: 0,
    waitlistedCount: 0,
    totalFeesPaid: 0,
    paidEventsCount: 0,
    eventsByCategory: [],
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
          ...response.data,
          totalFeesPaid: response.data.totalFeesPaid || 0,
          eventsByCategory: response.data.eventsByCategory || [],
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

  // Data for charts
  const eventParticipationData = [
    { name: "Past Events", value: overview.pastEvents },
    { name: "Upcoming Events", value: overview.upcomingEvents },
    { name: "Waitlisted", value: overview.waitlistedCount },
  ];

  const eventsByCategoryData = overview.eventsByCategory.map((category) => ({
    name: category._id || "Other",
    events: category.count,
  }));

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <Skeleton height={20} width="70%" />
              <Skeleton height={24} width="50%" className="mt-2" />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton height={300} className="rounded-lg border border-gray-200 dark:border-gray-800" />
          <Skeleton height={300} className="rounded-lg border border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    );

  if (error) return <p className="text-red-500 dark:text-red-400 p-6">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Participations" value={overview.totalEventsParticipated} />
        <StatCard title="Upcoming Events" value={overview.upcomingEvents} />
        <StatCard title="Past Events" value={overview.pastEvents} />
        <StatCard title="Pending Registrations" value={overview.pendingRegistrations} />
        <StatCard title="Waitlisted" value={overview.waitlistedCount} />
        <StatCard
          title="Total Fees Paid"
          value={`₹${overview.totalFeesPaid.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Successful Payments"
          value={overview.paidEventsCount}
        />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Participation Pie Chart */}
        <SectionCard title="Event Distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventParticipationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {eventParticipationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value} events`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Events by Category Bar Chart */}
        <SectionCard title="Events by Category">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsByCategoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Additional Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Financial Summary">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Paid"
              value={`₹${overview.totalFeesPaid.toLocaleString('en-IN')}`}
              small
            />
            <StatCard
              title="Transactions"
              value={overview.paidEventsCount}
              small
            />
            <StatCard
              title="Pending Registrations"
              value={overview.pendingRegistrations}
              small
            />
            <StatCard
              title="Waitlisted"
              value={overview.waitlistedCount}
              small
            />
          </div>
        </SectionCard>

        <SectionCard title="Event Breakdown">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Upcoming"
              value={overview.upcomingEvents}
              small
            />
            <StatCard
              title="Past Events"
              value={overview.pastEvents}
              small
            />
            <StatCard
              title="Categories"
              value={overview.eventsByCategory.length}
              small
            />
            <StatCard
              title="Total Participated"
              value={overview.totalEventsParticipated}
              small
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, small = false }) => (
  <div
    className={`bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-800 ${
      small ? "py-3" : ""
    }`}
  >
    <h3 className={`${small ? "text-sm" : "text-sm lg:text-lg"} font-medium text-gray-600 dark:text-gray-300`}>
      {title}
    </h3>
    <p className={`${small ? "text-xl" : "text-2xl"} mt-1 font-bold text-gray-900 dark:text-white`}>
      {value}
    </p>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-800">
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
      {title}
    </h3>
    {children}
  </div>
);

export default StudentDashboardOverviewPage;