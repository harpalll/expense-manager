import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategory = createAsyncThunk(
  "/category",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Category");
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

export const fetchCategoryById = createAsyncThunk(
  "/category/fetchById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Category/${categoryId}`);
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

export const toggleCategoryStatus = createAsyncThunk(
  "/category/toggleStatus",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/Category/${categoryId}/toggle-active`
      );
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveCategory = createAsyncThunk(
  "/category/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/Category/active`);
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveExpenseCategory = createAsyncThunk(
  "/category/fetchActiveExpense",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/Category/active/expenses`);
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveIncomeCategory = createAsyncThunk(
  "/category/fetchActiveIncome",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/Category/active/incomes`);
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    activeCategory: [],
    activeCategoryLoading: false,
    loading: false,
    categoryDetails: null,
    detailsLoading: false,
    toggleLoading: false,
    activeExpenseCategory: [],
    activeExpenseCategoryLoading: false,
    activeIncomeCategory: [],
    activeIncomeCategoryLoading: false,
  },
  reducers: {
    clearcategoryDetails: (state) => {
      state.categoryDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategory.rejected, (state) => {
        state.loading = false;
      })
      // * Get ALL active
      .addCase(fetchActiveCategory.pending, (state) => {
        state.activeCategoryLoading = true;
      })
      .addCase(fetchActiveCategory.fulfilled, (state, action) => {
        state.activeCategoryLoading = false;
        state.activeCategory = action.payload;
      })
      .addCase(fetchActiveCategory.rejected, (state) => {
        state.activeCategoryLoading = false;
      })
      // * Get All Expense
      .addCase(fetchActiveExpenseCategory.pending, (state) => {
        state.activeExpenseCategoryLoading = true;
      })
      .addCase(fetchActiveExpenseCategory.fulfilled, (state, action) => {
        state.activeExpenseCategoryLoading = false;
        state.activeExpenseCategory = action.payload;
      })
      .addCase(fetchActiveExpenseCategory.rejected, (state) => {
        state.activeExpenseCategoryLoading = false;
      })
      // * Get All Income
      .addCase(fetchActiveIncomeCategory.pending, (state) => {
        state.activeIncomeCategoryLoading = true;
      })
      .addCase(fetchActiveIncomeCategory.fulfilled, (state, action) => {
        state.activeIncomeCategoryLoading = false;
        state.activeIncomeCategory = action.payload;
      })
      .addCase(fetchActiveIncomeCategory.rejected, (state) => {
        state.activeIncomeCategoryLoading = false;
      })
      // * Fetch by ID cases
      .addCase(fetchCategoryById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.categoryDetails = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * Toggle Cases
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.toggleLoading = true;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state) => {
        state.toggleLoading = false;
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearcategoryDetails } = categorySlice.actions;

export default categorySlice.reducer;
