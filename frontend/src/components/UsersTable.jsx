import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import NotificationModal from "./NotificationModal";

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
          `${BASE_URL}/firebase/send-notification`,
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
          `${BASE_URL}/firebase/send-notification/all`,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

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
              className="border rounded px-4 py-2 w-50"
            />
          </div>

          <div>
            <NotificationModal
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
                className={`${selectedUsers.length === 0 ? "bg-gray-400" : "bg-blue-500"} text-white px-4 py-2 rounded`}
                disabled={selectedUsers.length === 0}
              >
                Send Notification to Selected Users
              </button>
              <button
                onClick={() => openModal("all")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Send Notification to All Users
              </button>
            </div>

          </div>
        </div>



        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {filteredUsers.length === 0 ? (
            <div className="py-4 text-center text-gray-700">No users found</div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Select</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">UID</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Display Name</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3 px-6 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700">{user._id}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{user.email}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{user.name || "N/A"}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="border px-4 py-2 rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Student</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
