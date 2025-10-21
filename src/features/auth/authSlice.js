import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserInfo = createAsyncThunk(
  "/userInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Auth/me");
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

const authSlice = createSlice({
  name: "auth",
  initialState: { user: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
