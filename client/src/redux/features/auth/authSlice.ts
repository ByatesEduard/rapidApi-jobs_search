import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

const API_URL = "/auth";

interface User {
  _id: string;
  email: string;
  likedJobs?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const initialState: AuthState = {
  user: null,
  token: initialToken,
  isLoading: false,
  error: null,
  isAuthenticated: Boolean(initialToken),
};

const saveToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
  }
};

const saveLikedJobs = (likedJobs: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("likedJobs", JSON.stringify(likedJobs));
  }
};

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${API_URL}/register`, credentials);
      saveToken(res.data.token);
      saveLikedJobs(res.data.user?.likedJobs || []);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${API_URL}/login`, credentials);
      saveToken(res.data.token);
      saveLikedJobs(res.data.user?.likedJobs || []);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return rejectWithValue("No token found");
    const res = await axiosInstance.get(`${API_URL}/me`);
    saveToken(res.data.token);
    saveLikedJobs(res.data.user?.likedJobs || []);
    return res.data;
  } catch (err: any) {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    return rejectWithValue(err.response?.data?.message || "Failed to get user data");
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      saveToken(null);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      saveLikedJobs([]);
    },
    clearError: (state) => { state.error = null; },
    updateLikedJobs: (state, action) => {
      const liked = action.payload as string[];
      if (state.user) state.user.likedJobs = liked;
      saveLikedJobs(liked);
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => { state.isLoading = true; state.error = null; };
    const handleRejected = (state: AuthState, action: any) => { state.isLoading = false; state.error = action.payload; state.isAuthenticated = false; };
    const handleFulfilled = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      saveLikedJobs(action.payload.user?.likedJobs || []);
    };

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(getMe.pending, handlePending)
      .addCase(getMe.fulfilled, handleFulfilled)
      .addCase(getMe.rejected, handleRejected);
  },
});

export const { logout, clearError, updateLikedJobs } = authSlice.actions;
export default authSlice.reducer;
