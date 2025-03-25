import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { RxCaretSort } from "react-icons/rx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentsManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", order: "asc" });
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/payment/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch payments.");
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchText = searchQuery.trim();
      if (!searchText) return true;
      return (
        payment.user.name.toLowerCase().includes(searchText) ||
        payment.user.email.toLowerCase().includes(searchText) ||
        payment.event.title.toLowerCase().includes(searchText) ||
        payment.paymentId.toLowerCase().includes(searchText) ||
        payment.status.toLowerCase().includes(searchText) ||
        payment.provider.toLowerCase().includes(searchText)
      );
    });
  }, [payments, searchQuery]);

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      const getNestedValue = (obj, key) => {
        return key.split('.').reduce((o, k) => (o || {})[k], obj);
      };

      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      let compareA = aValue;
      let compareB = bValue;

      if (['timestamp', 'createdAt', 'updatedAt'].includes(sortConfig.key)) {
        compareA = new Date(aValue).getTime();
        compareB = new Date(bValue).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        compareA = aValue.toLowerCase();
        compareB = bValue.toLowerCase();
      }

      return sortConfig.order === 'asc' 
        ? compareA > compareB ? 1 : -1
        : compareA < compareB ? 1 : -1;
    });
  }, [filteredPayments, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Payment Transactions</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by user, event, payment ID, status, or provider"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border dark:border-gray-700 rounded px-4 py-2 w-full bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
          {!loading && filteredPayments.length === 0 ? (
            <div className="py-4 text-center">No payments found</div>
          ) : (
            <table className="min-w-full table-auto dark:bg-gray-900">
              <thead className="bg-teal-600 dark:bg-gray-900 border-b dark:border-gray-700 text-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium">
                    <input type="checkbox" />
                  </th>
                  {[
                    { key: 'user.name', label: 'User' },
                    { key: 'event.title', label: 'Event' },
                    { key: 'paymentId', label: 'Payment ID' },
                    { key: 'status', label: 'Status' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'provider', label: 'Provider' },
                    { key: 'timestamp', label: 'Date' },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="py-3 px-6 text-sm font-medium cursor-pointer hover:bg-teal-700"
                      onClick={() => handleSort(key)}
                    >
                      <p className="flex items-center gap-2 justify-between">
                        {label}
                        <RxCaretSort size={20} />
                      </p>
                    </th>
                  ))}
                  <th className="py-3 px-6 text-sm font-medium">Payment Link</th>
                  <th className="py-3 px-6 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="p-3">
                        <Skeleton width={20} height={20} />
                      </td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="py-3 px-6 text-sm">
                          <Skeleton width={100} />
                        </td>
                      ))}
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={100} />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <Skeleton width={50} />
                      </td>
                    </tr>
                  ))
                ) : (
                  sortedPayments.map((payment) => (
                    <tr key={payment._id} className="border-b dark:border-gray-700">
                      <td className="py-3 px-6 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment._id)}
                          onChange={() => handleSelectPayment(payment._id)}
                        />
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.user.name}</span>
                          <span className="text-gray-500 text-xs">{payment.user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.event.title}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(payment.event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm">{payment.paymentId}</td>
                      <td className="py-3 px-6 text-sm">
                        <span
                          className={`px-2 py-1 rounded ${
                            payment.status === 'paid'
                              ? 'bg-green-600/10 text-green-600'
                              : payment.status === 'pending'
                              ? 'bg-yellow-600/10 text-yellow-600'
                              : 'bg-red-600/10 text-red-600'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {payment.currency} {payment.amount}
                      </td>
                      <td className="py-3 px-6 text-sm">{payment.provider}</td>
                      <td className="py-3 px-6 text-sm">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <a
                          href={payment.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          View Link
                        </a>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <button className="text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsManagementPage;