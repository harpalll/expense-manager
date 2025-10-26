import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserInfo = createAsyncThunk(
  "auth/userInfo",
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

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
  window.location.href = "/";
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      // window.location.href = "/";
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
    setAuthToken: (_, action) => {
      const token = action.payload;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, setAuthToken } = authSlice.actions;

export default authSlice.reducer;
