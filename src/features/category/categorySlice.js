import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategory = createAsyncThunk("/category", async () => {
  const response = await axios.get("/api/Category");
  return response.data.data;
});

export const fetchCategoryById = createAsyncThunk(
  "/category/fetchById",
  async (categoryId) => {
    const response = await axios.get(`/api/Category/${categoryId}`);
    return response.data.data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    loading: false,
    categoryDetails: null,
    detailsLoading: false,
  },
  reducers: {
    clearcategoryDetails: (state) => {
      state.categoryDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      // Fetch by ID cases
      .addCase(fetchCategoryById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.categoryDetails = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state) => {
        state.detailsLoading = false;
      });
  },
});

export const { addNewCategory, deleteCategory, clearcategoryDetails } =
  categorySlice.actions;

export default categorySlice.reducer;
