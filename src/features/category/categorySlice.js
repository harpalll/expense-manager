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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    loading: false,
    categoryDetails: null,
    detailsLoading: false,
    toggleLoading: false,
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
