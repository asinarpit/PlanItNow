import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

const FeedbackTable = () => {
  const { eventId } = useParams();
  const {token} = useSelector(state=>state.auth);
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/feedback/event/${eventId}`, {
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
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Comment</th>
              <th className="px-6 py-3">Date</th>
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
                  <td className="px-6 py-4">{feedback.userId.name}</td>
                  <td className="px-6 py-4">{feedback.rating}</td>
                  <td className="px-6 py-4">{feedback.comment}</td>
                  <td className="px-6 py-4">
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

export default FeedbackTable;
