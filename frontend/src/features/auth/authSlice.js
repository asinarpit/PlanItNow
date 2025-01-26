import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  token: null,
  email: null,
  role: null,
  deviceToken: null, 
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
        token: response.data.token,
        role: response.data.role,
        name: response.data.name,
        email: response.data.email,
        deviceToken: response.data.deviceToken, 
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
        token: response.data.token,
        role: response.data.role,
        name: response.data.name,
        email: response.data.email,
        deviceToken: response.data.deviceToken, 
      };
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
      state.user = null;
      state.token = null;
      state.role = null;
      state.deviceToken = null;
    },
    setDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
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
        state.role = action.payload.role;
        state.user = action.payload.name;
        state.email = action.payload.email;
        state.deviceToken = action.payload.deviceToken; 
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
        state.role = action.payload.role;
        state.user = action.payload.name;
        state.email = action.payload.email;
        state.deviceToken = action.payload.deviceToken; 
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setDeviceToken } = authSlice.actions;
export default authSlice.reducer;
