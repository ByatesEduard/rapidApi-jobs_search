// features/jobs/jobsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rapidApiClient from "../../../utils/rapidApiClient"
import axios from "axios";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  job_description?: string;
}

interface JobsState {
  items: Job[];
  isLoading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (query: string, { rejectWithValue }) => {
    try {
      const cacheKey = `jobs-${query}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as Job[];
      }

      const response = await rapidApiClient.get("/search", {
        params: {
          query,
          page: 1,
          num_pages: 1,
          country: "us",
          date_posted: "all",
        },
      });

      const jobs = response.data.data as Job[];
      localStorage.setItem(cacheKey, JSON.stringify(jobs));
      return jobs;
    } catch (err: unknown) {
      // Типізований catch
      let message = "Failed to fetch jobs";

      if (axios.isAxiosError(err) && err.response) {
        message = err.response.data?.message || message;
      }

      return rejectWithValue(message);
    }
  }
);



const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobsSlice.reducer;
