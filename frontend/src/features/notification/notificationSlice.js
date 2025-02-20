import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.notifications;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async ({ notificationId, token }, { rejectWithValue }) => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/${notificationId}/mark-read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return notificationId; // Returning notification ID to update the state
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (token, { rejectWithValue }) => {
        try {
            await axios.patch(
                `${BASE_URL}/notifications/mark-all-read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return true; // Indicating all are read
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark Single Notification as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((notification) =>
                    notification._id === action.payload
                        ? { ...notification, isRead: true }
                        : notification
                );
            })

            // Mark All Notifications as Read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }));
            });
    },
});

export default notificationSlice.reducer;
