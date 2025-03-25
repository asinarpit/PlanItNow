import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiSearch, FiDollarSign, FiUsers, FiClock} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FacultyPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/payment/transactions/my-events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load payments");
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${
        status === "paid" 
          ? "bg-green-100 text-green-600" 
          : "bg-yellow-100 text-yellow-600"
      }`}>
        {status}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment =>
    payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: payments.reduce((sum, payment) => sum + payment.amount, 0),
    registrations: payments.length,
    pending: payments.filter(p => p.status === "pending").length
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Student Registrations</h1>
        <p className="text-gray-600">Payments received for your events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FiDollarSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-xl font-semibold">
                ₹{loading ? <Skeleton width={80} /> : stats.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Registrations</p>
              <p className="text-xl font-semibold">
                {loading ? <Skeleton width={40} /> : stats.registrations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <FiClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-xl font-semibold">
                {loading ? <Skeleton width={40} /> : stats.pending}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative bg-white dark:bg-gray-900 border dark:border-gray-700">
        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search students or events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 bg-transparent"
        />
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border dark:bg-gray-900">
              <Skeleton height={20} count={3} />
            </div>
          ))
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No payments found
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment._id} className="bg-white dark:bg-gray-900 p-6 rounded-lg border hover:bg-gray-50 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-semibold">{payment.user.name}</h3>
                  <p className="text-sm text-gray-600">{payment.user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {payment.event.title}
                  </p>
                </div>
                
                <div className="md:text-right">
                  <div className="mb-2">{getStatusBadge(payment.status)}</div>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{payment.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <p>Transaction ID: {payment.paymentId}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyPaymentsPage;