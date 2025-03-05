import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: {
    name: null,
    id: null,
    image: null,
    email: null,
    role: null,
    deviceToken: null,
  },
  token: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, deviceToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
        deviceToken,
      });
      return {
        user: {
          id: response.data._id,
          name: response.data.name,
          image: response.data.image,
          email: response.data.email,
          role: response.data.role,
          deviceToken,
        },
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password, role, deviceToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        role,
        deviceToken,
      });
      return {
        user: {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          deviceToken,
        },
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, formData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { token } = state.auth;

      const response = await axios.put(`${BASE_URL}/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeDeviceToken = createAsyncThunk(
  "auth/removeDeviceToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { token } = state.auth;
      const { deviceToken } = state.auth.user;

      if (!deviceToken) return;

      const response = await axios.delete(
        `${BASE_URL}/user/remove-device-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { deviceToken },
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        ...state.user,
        name: null,
        id: null,
        image: null,
        email: null,
        role: null,
      };
      state.token = null;
    },
    setDeviceToken: (state, action) => {
      state.user.deviceToken = action.payload;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = { ...state.user, ...user };
      state.token = token;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // .addCase(removeDeviceToken.fulfilled, (state) => {
      //   state.user.deviceToken = null;
      // })
      .addCase(removeDeviceToken.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setDeviceToken, setCredentials } = authSlice.actions;
export default authSlice.reducer;
