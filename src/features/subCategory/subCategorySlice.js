import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSubCategory = createAsyncThunk(
  "/subCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/SubCategory");
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

export const fetchSubCategoryById = createAsyncThunk(
  "/subCategory/fetchById",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/SubCategory/${subCategoryId}`);
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

export const toggleSubCategoryStatus = createAsyncThunk(
  "/subCategory/toggleStatus",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/SubCategory/${subCategoryId}/toggle-active`
      );
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveExpenseSubCategory = createAsyncThunk(
  "/subCategory/fetchActiveExpense",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `api/SubCategory/category/${categoryId}/expense-active`
      );
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveIncomeSubCategory = createAsyncThunk(
  "/subCategory/fetchActiveIncome",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `api/SubCategory/category/${categoryId}/income-active`
      );
      return response.data.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: {
    subCategory: [],
    loading: false,
    subCategoryDetails: null,
    detailsLoading: false,
    toggleLoading: false,
    activeExpenseSubCategory: [],
    activeExpenseSubCategoryLoading: false,
    activeIncomeSubCategory: [],
    activeIncomeSubCategoryLoading: false,
  },
  reducers: {
    clearsubcategoryDetails: (state) => {
      state.subCategoryDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchSubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategory = action.payload;
      })
      .addCase(fetchSubCategory.rejected, (state) => {
        state.loading = false;
      })
      // * Get All Expense
      .addCase(fetchActiveExpenseSubCategory.pending, (state) => {
        state.activeExpenseSubCategoryLoading = true;
      })
      .addCase(fetchActiveExpenseSubCategory.fulfilled, (state, action) => {
        state.activeExpenseSubCategoryLoading = false;
        state.activeExpenseSubCategory = action.payload;
      })
      .addCase(fetchActiveExpenseSubCategory.rejected, (state) => {
        state.activeExpenseSubCategoryLoading = false;
      })
      // * Get All Income
      .addCase(fetchActiveIncomeSubCategory.pending, (state) => {
        state.activeIncomeSubCategoryLoading = true;
      })
      .addCase(fetchActiveIncomeSubCategory.fulfilled, (state, action) => {
        state.activeIncomeSubCategoryLoading = false;
        state.activeIncomeSubCategory = action.payload;
      })
      .addCase(fetchActiveIncomeSubCategory.rejected, (state) => {
        state.activeIncomeSubCategoryLoading = false;
      })
      // * Fetch by ID cases
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.subCategoryDetails = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * Toggle Cases
      .addCase(toggleSubCategoryStatus.pending, (state) => {
        state.toggleLoading = true;
      })
      .addCase(toggleSubCategoryStatus.fulfilled, (state) => {
        state.toggleLoading = false;
      })
      .addCase(toggleSubCategoryStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearsubcategoryDetails } = subCategorySlice.actions;

export default subCategorySlice.reducer;
