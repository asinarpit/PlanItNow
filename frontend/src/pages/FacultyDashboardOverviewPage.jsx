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

const FacultyDashboardOverviewPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({
    totalEventsCreated: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    pendingApprovals: 0,
    approvedEvents: 0,
    totalRegistrations: 0,
    eventsByTypeCreated: [],
    waitlistedParticipants: 0,
    totalRevenue: 0,
    avgParticipants: 0,
    paidEventsCount: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyDashboardStats = async () => {
      try {
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        setLoading(true);
        const response = await axios.get(`${BASE_URL}/dashboard/stats/faculty`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview({
          ...response.data,
          eventsByTypeCreated: response.data.eventsByTypeCreated || [],
          totalRevenue: response.data.totalRevenue || 0,
          avgParticipants: Number(response.data.avgParticipants?.toFixed(1)) || 0,
        });
      } catch (err) {
        setError("Failed to fetch faculty dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyDashboardStats();
  }, [token]);

  // Data for charts
  const eventsByTypeData = overview.eventsByTypeCreated.map((type) => ({
    name: type._id || "Other",
    events: type.count,
  }));

  const paymentInsightsData = [
    { name: "Revenue", value: overview.totalRevenue },
    { name: "Avg Participants", value: overview.avgParticipants },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading)
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
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
    <div className="space-y-6 p-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={overview.totalEventsCreated} />
        <StatCard title="Total Participants" value={overview.totalParticipants} />
        <StatCard title="Upcoming Events" value={overview.upcomingEvents} />
        <StatCard title="Pending Approvals" value={overview.pendingApprovals} />
        <StatCard title="Approved Events" value={overview.approvedEvents} />
        <StatCard title="Total Registrations" value={overview.totalRegistrations} />
        <StatCard title="Waitlisted" value={overview.waitlistedParticipants} />
        <StatCard
          title="Avg Participants"
          value={overview.avgParticipants.toFixed(1)}
        />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Events by Type Bar Chart */}
        <SectionCard title="Events by Type">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsByTypeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Financial Overview Pie Chart */}
        <SectionCard title="Financial Overview">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentInsightsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {paymentInsightsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    name === "Revenue" ? `₹${value.toLocaleString('en-IN')}` : value.toFixed(1),
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Additional Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Financial Summary">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Revenue"
              value={`₹${overview.totalRevenue.toLocaleString('en-IN')}`}
              small
            />
            <StatCard
              title="Successful Payments"
              value={overview.paidEventsCount}
              small
            />
            <StatCard
              title="Upcoming Events"
              value={overview.upcomingEvents}
              small
            />
            <StatCard
              title="Avg Participants"
              value={overview.avgParticipants.toFixed(1)}
              small
            />
          </div>
        </SectionCard>

        <SectionCard title="Participant Insights">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Registrations"
              value={overview.totalRegistrations}
              small
            />
            <StatCard
              title="Waitlisted"
              value={overview.waitlistedParticipants}
              small
            />
            <StatCard
              title="Pending Approvals"
              value={overview.pendingApprovals}
              small
            />
            <StatCard
              title="Approved Events"
              value={overview.approvedEvents}
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
    <h3 className={`${small ? "text-sm" : "text-lg"} font-medium text-gray-600 dark:text-gray-300`}>
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

export default FacultyDashboardOverviewPage;