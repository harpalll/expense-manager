import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserInfo = createAsyncThunk("/userInfo", async () => {
  const response = await axios.get("/api/Auth/me");
  return response.data.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
