import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllReviews, createReview, getReviewDetail, getHotelReviews } from "../../services/api";

// Fetch all reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllReviews();
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Fetch Reviews Error:', error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Create a new review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createReview(data);
      return response.data;
    } catch (error) {
      console.error('Create Review Error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        "Failed to create review"
      );
    }
  }
);

export const fetchReviewDetail = createAsyncThunk(
  "reviews/fetchReviewDetail",
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching review with ID:', id);
      const response = await getReviewDetail(id);
      return response.data;
    } catch (error) {
      console.error('Fetch Review Detail Error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      return rejectWithValue(error.response?.data?.message || "Failed to fetch review details");
    }
  }
);

export const fetchHotelReviews = createAsyncThunk(
  "reviews/fetchHotelReviews",
  async (hotelId, { rejectWithValue }) => {
    try {
      console.log('Fetching reviews for hotel ID:', hotelId);
      const response = await getHotelReviews(hotelId);
      console.log('Received reviews:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch Hotel Reviews Error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data
      });
      return rejectWithValue(error.response?.data?.message || "Failed to fetch hotel reviews");
    }
  }
);
// Initial state
const initialState = {
  reviews: [],
  loading: false,
  error: null,
  reviewDetail: null,
  hotelReviews: [],
};

// Slice
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload); // ✅ add new review to the list
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Review Detail
      .addCase(fetchReviewDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDetail = action.payload;
      })
      .addCase(fetchReviewDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Hotel Reviews
      .addCase(fetchHotelReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelReviews = action.payload;
      })
      .addCase(fetchHotelReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default reviewsSlice.reducer;
