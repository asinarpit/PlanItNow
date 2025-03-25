import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router";
import Portal from "./Portal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventCard = ({ event }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [isRegistered, setIsRegistered] = useState(
    event.participants.some((participant) => participant._id === user.id)
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isPaid = event.registrationRequired && event.registrationFee > 0;

  const handleToggleRegistration = () => {
    if (loading) return;

    if (isRegistered) {
      if (isPaid) {
        setShowCancelModal(true);
      } else {
        handleCancelRegistration();
      }
    } else {
      if (isPaid) {
        setShowPaymentModal(true);
      } else {
        handleFreeRegistration();
      }
    }
  };

  const handleProceedToPayment = async () => {
    setShowPaymentModal(false);
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/payment/pay?amount=${event.registrationFee}&eventId=${event._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/events/${event._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRegistered(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFreeRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/events/${event._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRegistered(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/events/${event._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRegistered(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/events/${event._id}`);
  };

  // Date formatting
  const startDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const dateDisplay =
    endDate && startDate.getTime() !== endDate.getTime()
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : formatDate(startDate);

  return (
    <>
      <div className="group/card h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            className="w-full h-40 object-cover transition-transform duration-300 group-hover/card:scale-105 cursor-pointer"
            src={event.image || "https://placehold.co/400"}
            alt={event.title}
            onClick={handleCardClick}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />

          <div className="absolute bottom-2 left-2 flex gap-1.5 items-end">
            <div className="backdrop-blur-sm bg-gray-800/60 text-white px-2 py-0.5 rounded-md text-xs font-medium">
              {event.eventType}
            </div>
            <div className="backdrop-blur-sm bg-gray-800/60 text-white px-2 py-0.5 rounded-md text-xs font-medium">
              {isPaid ? "Paid" : "Free"}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-3 flex-grow">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              onClick={handleCardClick}
            >
              {event.title}
            </h3>

            {event.department && (
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-2">
                {event.department}
              </p>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-tight">
              {event.shortDescription}
            </p>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="mr-2 text-teal-600 dark:text-teal-400 flex-shrink-0 text-sm" />
              <span className="text-sm font-medium">{dateDisplay}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="mr-2 text-teal-600 dark:text-teal-400 flex-shrink-0 text-sm" />
              <span className="text-sm font-medium">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaUsers className="mr-2 text-teal-600 dark:text-teal-400 flex-shrink-0 text-sm" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>{event.participants?.length || 0} Registered</span>
                  <span>{event.capacity} Spots</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((event.participants?.length || 0) / event.capacity) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {event.registrationRequired && (
            <div className="mt-auto">
              <button
                onClick={handleToggleRegistration}
                disabled={loading}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${isRegistered
                  ? "bg-transparent border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 dark:border-teal-400 dark:text-teal-400"
                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md dark:bg-teal-700 dark:hover:bg-teal-600"
                  } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <ImSpinner8 className="animate-spin mr-2 text-current" />
                ) : isRegistered ? (
                  "Cancel Registration"
                ) : isPaid ? (
                  <>
                    <span>Register</span>
                    <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                    ₹{event.registrationFee}
                    </span>
                  </>
                ) : (
                  "Register Now"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Proceed to Payment</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You will be redirected to the payment page to complete your registration.
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Cancellation Warning Modal */}
      {showCancelModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Cancel Registration</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Canceling your registration for this paid event will not result in a refund.
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default EventCard;