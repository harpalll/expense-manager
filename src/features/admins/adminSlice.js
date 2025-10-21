import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdmins = createAsyncThunk("/admins", async () => {
  const response = await axios.get("/api/User");
  return response.data.data;
});

const adminSlice = createSlice({
  name: "admins",
  initialState: { data: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addNewLead, deleteLead } = adminSlice.actions;

export default adminSlice.reducer;
