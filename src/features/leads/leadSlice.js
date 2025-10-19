import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLeads = createAsyncThunk("/leads/content", async () => {
  const response = await axios.get("/api/users?page=2", {});
  return response.data;
});

const leadsSlice = createSlice({
  name: "leads",
  initialState: { data: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeads.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addNewLead, deleteLead } = leadsSlice.actions;

export default leadsSlice.reducer;
