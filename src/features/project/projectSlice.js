import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProject = createAsyncThunk(
  "/project/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Project");
      return response.data.data;
    } catch (error) {
      if (error.response) {
        // API returned a status code outside 2xx
        return rejectWithValue({
          message: error.response.data.message,
          status: error.response.status,
        });
      } else if (error.request) {
        // No response
        return rejectWithValue({ message: "No response received from server" });
      } else {
        // Something else
        return rejectWithValue({
          message: `Request setup failed: ${error.message}`,
        });
      }
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "/project/fetchById",
  async (peopleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Project/${peopleId}`);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        // API returned a status code outside 2xx
        return rejectWithValue({
          message: error.response.data.message,
          status: error.response.status,
        });
      } else if (error.request) {
        // No response
        return rejectWithValue({ message: "No response received from server" });
      } else {
        // Something else
        return rejectWithValue({
          message: `Request setup failed: ${error.message}`,
        });
      }
    }
  }
);

export const toggleProjectStatus = createAsyncThunk(
  "/project/toggleStatus",
  async (peopleID, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/Project/${peopleID}/toggle-active`
      );
      return response.data.data;
    } catch (err) {
      if (err.response) return rejectWithValue(err.response.data.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchActiveProject = createAsyncThunk(
  "/project/active",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/Project/active`);
      return response.data.data;
    } catch (err) {
      if (err.response) return rejectWithValue(err.response.data.message);
      return rejectWithValue(err.message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: [],
    loading: false,
    error: null,
    projectDetails: null,
    detailsLoading: false,
    toggleLoading: false,
    activeProject: [],
    activeProjectLoading: false,
  },
  reducers: {
    clearprojectDetails: (state) => {
      state.projectDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // * Get All active
      .addCase(fetchActiveProject.pending, (state) => {
        state.activeProjectLoading = true;
      })
      .addCase(fetchActiveProject.fulfilled, (state, action) => {
        state.activeProjectLoading = false;
        state.activeProject = action.payload;
      })
      .addCase(fetchActiveProject.rejected, (state) => {
        state.activeProjectLoading = false;
      })
      // * Fetch by ID cases
      .addCase(fetchProjectById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.projectDetails = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * Toggle Status Cases
      .addCase(toggleProjectStatus.pending, (state) => {
        state.toggleLoading = true;
      })
      .addCase(toggleProjectStatus.fulfilled, (state) => {
        state.toggleLoading = false;
      })
      .addCase(toggleProjectStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearprojectDetails } = projectSlice.actions;

export default projectSlice.reducer;
