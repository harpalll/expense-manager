import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// useEffect(() => {
//   const fetchPeople = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/People");
//       setPeople(response.data.data);
//     } catch (error) {
//       if (error.response) {
//         toast.error(`ERROR: ${error.response.data.message}`);
//         console.error(
//           `ERROR: Status Code: ${error.response.status} || ERRORS:`,
//           error.response.data
//         );
//       } else if (error.request) {
//         // no response
//         toast.error("ERROR: No response received from server");
//         console.error(
//           "ERROR: No response received from server",
//           error.request
//         );
//       } else {
//         // Something else went wrong
//         toast.error("ERROR: Request setup failed");
//         console.error("ERROR: Request setup failed", error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchPeople();
// }, []);
export const fetchPeople = createAsyncThunk(
  "/people/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/People");
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

export const fetchPeopleById = createAsyncThunk(
  "/people/fetchById",
  async (peopleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/People/${peopleId}`);
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

export const togglePeopleStatus = createAsyncThunk(
  "/people/toggleStatus",
  async (peopleID, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/People/${peopleID}/toggle-active`
      );
      return response.data.data;
    } catch (err) {
      if (err.response) return rejectWithValue(err.response.data.message);
      return rejectWithValue(err.message);
    }
  }
);

const peopleSlice = createSlice({
  name: "people",
  initialState: {
    people: [],
    loading: false,
    error: null,
    peopleDetails: null,
    detailsLoading: false,
    toggleLoading: false,
  },
  reducers: {
    clearpeopleDetails: (state) => {
      state.peopleDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // * Get ALL
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.people = action.payload;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // * Fetch by ID cases
      .addCase(fetchPeopleById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchPeopleById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.peopleDetails = action.payload;
      })
      .addCase(fetchPeopleById.rejected, (state) => {
        state.detailsLoading = false;
      })
      // * Toggle Status Cases
      .addCase(togglePeopleStatus.pending, (state) => {
        state.toggleLoading = true;
      })
      .addCase(togglePeopleStatus.fulfilled, (state) => {
        state.toggleLoading = false;
      })
      .addCase(togglePeopleStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearpeopleDetails } = peopleSlice.actions;

export default peopleSlice.reducer;
