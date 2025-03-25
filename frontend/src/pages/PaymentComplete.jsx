import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCalendarAlt, FaReceipt } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ImSpinner8 } from 'react-icons/im';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  console.log(token);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get('transactionId');
  const status = searchParams.get('status');

  console.log(transactionId, status)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/payment/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaymentDetails(res.data.data);
      } catch (error) {
        toast.error('Failed to verify payment');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (transactionId && status === 'paid') {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, [transactionId, status, navigate, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl text-teal-600">
          <ImSpinner8 />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center text-6xl text-green-500 mb-4">
            <FaCheckCircle />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for your registration. Your payment has been processed successfully.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Payment Details
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Event:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {paymentDetails.event.title}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                ₹{paymentDetails.amount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="text-gray-900 dark:text-white font-mono">
                {paymentDetails.paymentId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Date:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(paymentDetails.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => navigate(`/events/${paymentDetails.event._id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            <FaCalendarAlt className="text-lg" />
            View Event
          </button>

          <button
            onClick={() => navigate(`/dashboard/${user.role}`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FaReceipt className="text-lg" />
            View Dashboard
          </button>
        </div>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          A confirmation email has been sent to {user?.email}.
          Please keep this transaction ID for future reference.
        </p>
      </div>
    </div>
  );
};

export default PaymentComplete;