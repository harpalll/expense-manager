import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExpense = createAsyncThunk(
  "/expense/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Expense");
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

export const fetchExpenseById = createAsyncThunk(
  "/expense/fetchById",
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Expense/${expenseId}`);
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

export const deleteExpense = createAsyncThunk(
  "/expense/delete",
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/Expense/${expenseId}`);
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expense: [],
    loading: false,
    expenseDetails: null,
    detailsLoading: false,
    deleteLoading: false,
  },
  reducers: {
    clearexpenseDetails: (state) => {
      state.expenseDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expense = action.payload;
      })
      .addCase(fetchExpense.rejected, (state) => {
        state.loading = false;
      })
      // * Fetch by ID cases
      .addCase(fetchExpenseById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.expenseDetails = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * delete Cases
      .addCase(deleteExpense.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearexpenseDetails } = expenseSlice.actions;

export default expenseSlice.reducer;
