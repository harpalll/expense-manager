import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchIncome = createAsyncThunk(
  "/income/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Income");
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

export const fetchIncomeById = createAsyncThunk(
  "/income/fetchById",
  async (incomeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Income/${incomeId}`);
      console.log(response.data.data);

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

export const deleteIncome = createAsyncThunk(
  "/income/delete",
  async (incomeId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/Income/${incomeId}`);
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    income: [],
    loading: false,
    incomeDetails: null,
    detailsLoading: false,
    deleteLoading: false,
  },
  reducers: {
    clearincomeDetails: (state) => {
      state.incomeDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchIncome.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.income = action.payload;
      })
      .addCase(fetchIncome.rejected, (state) => {
        state.loading = false;
      })
      // * Fetch by ID cases
      .addCase(fetchIncomeById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchIncomeById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.incomeDetails = action.payload;
      })
      .addCase(fetchIncomeById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * delete Cases
      .addCase(deleteIncome.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteIncome.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearincomeDetails } = incomeSlice.actions;

export default incomeSlice.reducer;
