import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  createHotelImage, 
  updateHotelImage, 
  deleteHotelImage, 
  listHotelImages 
} from "../../services/api";

// Fetch all images
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listHotelImages();
      console.log('Fetch Images Response:', response);
      return response.data;
    } catch (error) {
      console.error('Fetch Images Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch images");
    }
  }
);

// Create a new hotel image
export const addImage = createAsyncThunk(
  "images/addImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createHotelImage(formData);
      console.log('Create Image Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Image Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to create image");
    }
  }
);

// Update hotel image
export const editImage = createAsyncThunk(
  "images/editImage",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateHotelImage(id, formData);
      return response;
    } catch (error) {
      console.error('Update Image Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to update image");
    }
  }
);

// Delete hotel image
export const removeImage = createAsyncThunk(
  "images/removeImage",
  async (id, { rejectWithValue }) => {
    try {
      await deleteHotelImage(id);
      return id;
    } catch (error) {
      console.error('Delete Image Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to delete image");
    }
  }
);

// Initial state
const initialState = {
  images: [],
  loading: false,
  error: null,
};

// Slice
const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch images
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add image
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload);
      })
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit image
      .addCase(editImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.images.findIndex(image => image.id === action.payload.id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
      })
      .addCase(editImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove image
      .addCase(removeImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(image => image.id !== action.payload);
      })
      .addCase(removeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default imagesSlice.reducer;
