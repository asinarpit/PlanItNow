import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbacksPage = () => {
  const { eventId } = useParams();
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/feedback/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(response.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [eventId]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
       className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm mb-4"
      >
        Go Back
      </button>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full table-auto dark:bg-gray-900">
          <thead className="bg-teal-600 dark:bg-gray-900 text-gray-100 border-b dark:border-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium">User</th>
              <th className="py-3 px-6 text-left text-sm font-medium">Rating</th>
              <th className="py-3 px-6 text-left text-sm font-medium">Comment</th>
              <th className="py-3 px-6 text-left text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No feedback available.
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <tr
                  key={feedback._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="py-3 px-6 text-sm">{feedback.userId.name}</td>
                  <td className="py-3 px-6 text-sm">{feedback.rating}</td>
                  <td className="py-3 px-6 text-sm">{feedback.comment}</td>
                  <td className="py-3 px-6 text-sm">
                    {new Date(feedback.date).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbacksPage;
