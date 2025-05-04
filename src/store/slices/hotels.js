import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllHotels,
  createHotel,
  updateHotel,
  getHotelDetail,
  deleteHotel,
  filterHotelsByStars,
  getOwnerHotelBookings,
} from "../../services/api";

// Fetch all hotels
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllHotels();
      console.log("Fetch Hotels Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hotels"
      );
    }
  }
);

// Create a hotel
export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createHotel(data);
      return response.data;
    } catch (error) {
      if (error && typeof error.response?.data === 'object') {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

// Update a hotel
export const editHotel = createAsyncThunk(
  "hotels/editHotel",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateHotel(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update hotel");
    }
  }
);

// Get hotel details
export const fetchHotelDetail = createAsyncThunk(
  "hotels/fetchHotelDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getHotelDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hotel details"
      );
    }
  }
);

// get owner hotel details
export const fetchOwnerHotelDetails = createAsyncThunk(
  "hotels/fetchOwnerHotelDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getOwnerHotelBookings(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch owner hotel details"
      );
    }
  }
);

// Delete a hotel
export const removeHotel = createAsyncThunk(
  "hotels/removeHotel",
  async (id, { rejectWithValue }) => {
    try {
      await deleteHotel(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete hotel"
      );
    }
  }
);

// Filter hotels by stars
export const filterHotels = createAsyncThunk(
  "hotels/filterHotels",
  async (stars, { rejectWithValue }) => {
    try {
      const response = await filterHotelsByStars(stars);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to filter hotels"
      );
    }
  }
);

// Initial state
const initialState = {
  hotels: [],
  loading: false,
  error: null,
  formError:null,
  hotelDetail: null,
};

// Slice
const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add hotel
      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = [...state.hotels, action.payload];
      })
      .addCase(addHotel.rejected, (state, action) => {
        state.loading = false;
        state.formError = action.payload;
      })

      // Edit hotel
      .addCase(editHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHotel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hotels.findIndex(
          (hotel) => hotel.id === action.payload.id
        );
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
      })
      .addCase(editHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch hotel detail
      .addCase(fetchHotelDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelDetail = action.payload;
      })
      .addCase(fetchHotelDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch owner hotel detail
      .addCase(fetchOwnerHotelDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerHotelDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelDetail = action.payload;
      })
      .addCase(fetchOwnerHotelDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove hotel
      .addCase(removeHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = state.hotels.filter(
          (hotel) => hotel.id !== action.payload
        );
      })
      .addCase(removeHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filter hotels
      .addCase(filterHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(filterHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hotelsSlice.reducer;
