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

const AdminDashboardOverviewPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEventsCount: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    registeredUsers: 0,
    eventsByDepartment: [],
    eventsByType: [],
    cancelledEvents: 0,
    featuredEventsCount: 0,
    virtualEventsCount: 0,
    waitlistedParticipants: 0,
    totalRegistrationFees: 0,
    paidEventsCount: 0,
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
        const response = await axios.get(`${BASE_URL}/dashboard/stats/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverview({
          ...response.data,
          eventsByDepartment: response.data.eventsByDepartment || [],
          eventsByType: response.data.eventsByType || [],
          // Format currency for display
          totalRegistrationFees: response.data.totalRegistrationFees || 0,
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
  const departmentData = overview.eventsByDepartment.map((dept) => ({
    name: dept._id || "General",
    events: dept.count,
  }));

  const eventTypeData = overview.eventsByType.map((type) => ({
    name: type._id || "Other",
    events: type.count,
  }));

  const paymentStatusData = [
    { name: "Paid", value: overview.paidEventsCount },
    { name: "Pending", value: overview.pendingEvents },
    { name: "Failed", value: overview.cancelledEvents },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6"];

  if (loading)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow bg-white dark:bg-gray-900"
            >
              <Skeleton height={20} width="70%" />
              <Skeleton height={24} width="50%" className="mt-2" />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton height={300} className="rounded-lg" />
          <Skeleton height={300} className="rounded-lg" />
        </div>
      </div>
    );

  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={overview.totalEvents} />
        <StatCard title="Total Participants" value={overview.totalParticipants} />
        <StatCard title="Upcoming Events" value={overview.upcomingEventsCount} />
        <StatCard title="Pending Proposals" value={overview.pendingEvents} />
        <StatCard title="Approved Events" value={overview.approvedEvents} />
        <StatCard title="Registered Users" value={overview.registeredUsers} />
        <StatCard title="Featured Events" value={overview.featuredEventsCount} />
        <StatCard title="Cancelled Events" value={overview.cancelledEvents} />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Department-wise Events Bar Chart */}
        <SectionCard title="Events by Department">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Event Type Distribution */}
        <SectionCard title="Events by Type">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="events"
                  label
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Payment Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Payment Insights">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Revenue"
              value={`₹${overview.totalRegistrationFees.toLocaleString('en-IN')}`}
              small
            />
            <StatCard
              title="Successful Payments"
              value={overview.paidEventsCount}
              small
            />
            <StatCard
              title="Virtual Events"
              value={overview.virtualEventsCount}
              small
            />
            <StatCard
              title="Waitlisted"
              value={overview.waitlistedParticipants}
              small
            />
          </div>
        </SectionCard>

        <SectionCard title="Payment Status Distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value} transactions`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
    <h3 className={`${small ? "text-sm" : "text-sm sm:text-lg"} font-medium text-gray-600 dark:text-gray-300`}>
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

export default AdminDashboardOverviewPage;