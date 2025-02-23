import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await axios.get(`${BASE_URL}/events`);
  return response.data;
});

// Create an event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { getState }) => {
    const state = getState();
    const token = state.auth.token;

    const response = await axios.post(`${BASE_URL}/events`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

// Update an event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, updatedData }, { getState }) => {
    const state = getState();
    const token = state.auth.token;

    const response = await axios.put(`${BASE_URL}/events/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

// Delete an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { getState }) => {
    const state = getState();
    const token = state.auth.token;

    await axios.delete(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  }
);

// Update event status
export const updateEventStatus = createAsyncThunk(
  "events/updateEventStatus",
  async ({ id, status }, { getState }) => {
    const state = getState();
    const token = state.auth.token;

    const response = await axios.put(
      `${BASE_URL}/events/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

// Feature or unfeature an event
export const toggleFeatureEvent = createAsyncThunk(
  "events/toggleFeatureEvent",
  async ({ id, isFeatured }, { getState }) => {
    const state = getState();
    const token = state.auth.token;

    const response = await axios.patch(
      `${BASE_URL}/events/${id}/feature`,
      { isFeatured },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: { events: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1) state.events[index].status = action.payload.status;
      })
      .addCase(toggleFeatureEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event._id === action.payload._id
        );
        if (index !== -1)
          state.events[index].isFeatured = action.payload.isFeatured;
      });
  },
});

export default eventsSlice.reducer;
