// src/store/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBooking,
  getAllBookings,
  deleteBooking as deleteBookingAPI,
  getBookingDetail as getBookingDetailAPI,
  updateBooking as updateBookingAPI,
  getOwnerHotelBookings,
} from "../../services/api";
import { getCurrentUserBookings, getHotelBookings } from "../../services/api"; // Adjust the import path as necessary
import axios from "axios";

// Initial state for the booking slice
const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  formError:null,
};

// Thunks for async actions
export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async () => {
    const response = await getAllBookings();
    return response.data;
  }
);
// Fetching current user's bookings
export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async () => {
    const response = await getCurrentUserBookings();
    return response.data;
  }
);

export const fetchOwnerHotelBookings = createAsyncThunk(
  "hotels/fetchHotelBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOwnerHotelBookings();
      return response.data;
    } catch (error) {
      console.error("Fetch Hotel Bookings Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hotel bookings"
      );
    }
  }
);

export const addBooking = createAsyncThunk(
  "bookings/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createBooking(data);
      console.log("the booking data for id is ", response.data);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(
        "An unexpected error occurred. Please try again later."
      );
    }
  }
);

export const deleteBooking = createAsyncThunk("bookings/delete", async (id) => {
  await deleteBookingAPI(id);
  return id;
});

export const fetchBookingDetail = createAsyncThunk(
  "bookings/fetchDetail",
  async (id) => {
    const response = await getBookingDetailAPI(id);
    return response.data;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateBookingAPI(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);
// Fetching hotel bookings
export const fetchhotelBookings = createAsyncThunk(
  "bookings/fetchHotelBookings",
  async () => {
    const response = await getHotelBookings();
    return response.data;
  }
);

// Create the slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetching all bookings
    builder.addCase(fetchAllBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchAllBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetching user bookings
    builder.addCase(fetchUserBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchUserBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetching hotel bookings
    builder.addCase(fetchhotelBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchhotelBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchhotelBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Adding a new booking
    builder.addCase(addBooking.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings.push(action.payload);
    });
    builder.addCase(addBooking.rejected, (state, action) => {
      state.loading = false;
      state.formError = action.payload;
    });

    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
    });

    builder.addCase(fetchBookingDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedBooking = action.payload; // Storing the fetched booking in state
    });
    builder.addCase(fetchBookingDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updateBooking.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateBooking.fulfilled, (state, action) => {
      state.loading = false;
      // Update the booking in state by replacing it with the updated one
      state.bookings = state.bookings.map((booking) =>
        booking.id === action.payload.id ? action.payload : booking
      );
      if (
        state.selectedBooking &&
        state.selectedBooking.id === action.payload.id
      ) {
        state.selectedBooking = action.payload; // Update the selected booking if it's the one being edited
      }
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // fetch owner hotel bookings
    builder.addCase(fetchOwnerHotelBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOwnerHotelBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchOwnerHotelBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // builder.addCase(deleteBooking.fulfilled, (state, action) => {
    //   state.bookings = state.bookings.filter((b) => b.id !== action.payload);
    // });
  },
});

// Export actions
export default bookingSlice.reducer;
