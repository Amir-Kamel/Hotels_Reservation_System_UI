// src/store/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBooking, getAllBookings, deleteBooking as deleteBookingAPI, getBookingDetail as getBookingDetailAPI, updateBooking as updateBookingAPI } from '../../services/api';


// Initial state for the booking slice
const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

// Thunks for async actions
export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async () => {
  const response = await getAllBookings();
  return response.data;
});

export const addBooking = createAsyncThunk('bookings/add', async (data, { rejectWithValue }) => {
  try {
    const response = await createBooking(data);
    return response.data;
  } catch (err) {
    // Ensure the error is properly passed to the frontend
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data); // Send the error data to the frontend
    }
    return rejectWithValue('An unexpected error occurred. Please try again later.');
  }
});


export const deleteBooking = createAsyncThunk('bookings/delete', async (id) => {
  await deleteBookingAPI(id);
  return id;
});

export const fetchBookingDetail = createAsyncThunk('bookings/fetchDetail', async (id) => {
  const response = await getBookingDetailAPI(id);
  return response.data;
});

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateBookingAPI(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);



// Create the slice
const bookingSlice = createSlice({
  name: 'bookings',
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
      // If the action has a payload (from rejectWithValue), set it as the error
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = action.error.message; // fallback to default error message
      }
    });
    
    
    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
    });

    builder.addCase(fetchBookingDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBookingDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedBooking = action.payload;  // Storing the fetched booking in state
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
      if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
        state.selectedBooking = action.payload;  // Update the selected booking if it's the one being edited
      }
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });


  },
});

// Export actions
export default bookingSlice.reducer;
