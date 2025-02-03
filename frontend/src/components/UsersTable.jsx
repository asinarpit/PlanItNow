import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import NotificationFormModal from "./NotificationFormModal";
import Skeleton from "react-loading-skeleton";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(`${BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/user/change-role`,
        { userId, newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;
      toast.success("User role updated successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? { ...user, role: updatedUser.role } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("User deleted successfully");
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      closeDeleteModal();
    }
  };



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) => {
    const searchText = searchQuery.trim();
    if (!searchText) return true;
    return (
      user.email.toLowerCase().includes(searchText) ||
      user.name?.toLowerCase().includes(searchText)
    );
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserIdToDelete(null);
  };


  const handleSendNotification = async (type) => {
    try {
      if (type === "selected") {
        const recipients = filteredUsers.filter((user) => selectedUsers.includes(user._id));
        const deviceTokens = recipients.map((user) => user.deviceToken);

        if (deviceTokens.length === 0) {
          toast.error("No users selected or no device tokens available");
          return;
        }

        await axios.post(
          `${BASE_URL}/notifications/send-notification`,
          {
            title: notificationTitle,
            body: notificationBody,
            deviceTokens,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Notification sent successfully!");
      } else if (type === "all") {
        await axios.post(
          `${BASE_URL}/notifications/send-notification/all`,
          {
            title: notificationTitle,
            body: notificationBody,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Notification sent to all users!");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
    }
  };

  const openModal = (type) => {
    setNotificationType(type);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);


  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Users</h2>

        <div className="flex justify-between">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by email or name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border dark:border-gray-700 rounded px-4 py-2 w-50 bg-white dark:bg-gray-900 text-sm"
            />
          </div>

          <div>
            <NotificationFormModal
              isOpen={showModal}
              onClose={closeModal}
              onSendNotification={handleSendNotification}
              notificationTitle={notificationTitle}
              notificationBody={notificationBody}
              setNotificationTitle={setNotificationTitle}
              setNotificationBody={setNotificationBody}
              notificationType={notificationType}
            />

            <div className="mb-4 flex gap-4">
              <button
                onClick={() => openModal("selected")}
                className={`${selectedUsers.length === 0 ? "bg-gray-200 text-gray-300 dark:bg-gray-900 dark:text-gray-800" : "border border-teal-600 hover:bg-teal-600 hover:text-gray-100 text-teal-600"} px-4 py-2 rounded text-sm`}
                disabled={selectedUsers.length === 0}
              >
                Send Notification to Selected Users
              </button>
              <button
                onClick={() => openModal("all")}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm"
              >
                Send Notification to All Users
              </button>
            </div>

          </div>
        </div>



        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {!loading && filteredUsers.length === 0 ? (
            <div className="py-4 text-center">No users found</div>
          ) : (
            <table className="min-w-full table-auto dark:bg-gray-900">
              <thead className="bg-teal-600 dark:bg-gray-900 border-b dark:border-gray-700 text-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium">Select</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">UID</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">Email</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">Display Name</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">Role</th>
                  <th className="py-3 px-6 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b dark:border-gray-700">
                          <td className="p-3">
                            <Skeleton height={50} width={50} circle />
                          </td>
                          <td className="py-3 px-6 text-sm">
                            <Skeleton width={150} />
                          </td>
                          <td className="py-3 px-6 text-sm">
                            <Skeleton width={100} />
                          </td>
                          <td className="py-3 px-6 text-sm">
                            <Skeleton width={200} />
                          </td>
                          <td className="py-3 px-6 text-sm">
                            <Skeleton width={50} />
                          </td>
                          <td className="py-3 px-6 text-sm">
                            <Skeleton width={100} />
                          </td>
                        </tr>
                      ))}
                    </>

                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b dark:border-gray-700">
                        <td className="py-3 px-6 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                          />
                        </td>
                        <td className="py-3 px-6 text-sm">{user._id}</td>
                        <td className="py-3 px-6 text-sm">{user.email}</td>
                        <td className="py-3 px-6 text-sm">{user.name || "N/A"}</td>
                        <td className="py-3 px-6 text-sm">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`px-2 py-1 rounded 
          ${user.role === "admin" ? "bg-purple-600/10 text-purple-600" : ""}
          ${user.role === "faculty" ? "bg-blue-600/10 text-blue-600" : ""}
          ${user.role === "student" ? "bg-green-600/10 text-green-600" : ""}`}
                          >
                            <option className="bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-800" value="admin">Admin</option>
                            <option className="bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-800" value="faculty">Faculty</option>
                            <option className="bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-800" value="student">Student</option>
                          </select>
                        </td>
                        <td className="py-3 px-6 text-sm">
                          <button
                            onClick={() => openDeleteModal(user._id)}
                            className="bg-red-600/10 hover:bg-red-600/20 text-red-600 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))

                  )
                }

              </tbody>
            </table>
          )}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UsersTable;
