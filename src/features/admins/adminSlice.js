import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdmins = createAsyncThunk(
  "/admins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/User");
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

export const fetchAdminById = createAsyncThunk(
  "/admins/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/User/${userId}`);
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

const adminSlice = createSlice({
  name: "admins",
  initialState: {
    admins: [],
    loading: false,
    error: null,
    adminDetails: null,
    detailsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state) => {
        state.loading = false;
      })
      // * FetchById cases
      .addCase(fetchAdminById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.adminDetails = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state) => {
        state.detailsLoading = false;
      });
  },
});

export const {} = adminSlice.actions;

export default adminSlice.reducer;
