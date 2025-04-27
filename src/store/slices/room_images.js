import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  createRoomImage, 
  updateRoomImage, 
  deleteRoomImage, 
  listRoomImages 
} from "../../services/api";

// Fetch all images
export const fetchRoomImages = createAsyncThunk(
    "images/fetchImages",
    async (id, { rejectWithValue }) => {
        try {
            const response = await listRoomImages(id);
            console.log('Fetch Images Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Fetch Images Error:', error);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch images");
        }
    }
);
// Create a new Room image
export const addRoomImage = createAsyncThunk(
    "images/addImage",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await createRoomImage(formData);
            console.log('Create Image Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Create Image Error:', error);
            return rejectWithValue(error.response?.data?.message || "Failed to create image");
        }
    }
);
// Update Room image   
export const editRoomImage = createAsyncThunk(
    "images/editImage",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await updateRoomImage(id, formData);
            return response;
        } catch (error) {
            console.error('Update Image Error:', error);
            return rejectWithValue(error.response?.data?.message || "Failed to update image");
        }
    }
);

// Delete Room image    
export const removeRoomImage = createAsyncThunk(
    "images/removeImage",
    async (id, { rejectWithValue }) => {
        try {
            await deleteRoomImage(id);
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
// Create a slice   

const roomImagesSlice = createSlice({
    name: "roomImages",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomImages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoomImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
            })
            .addCase(fetchRoomImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addRoomImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRoomImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images.push(action.payload);
            })
            .addCase(addRoomImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editRoomImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(editRoomImage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.images.findIndex((image) => image.id === action.payload.id);
                if (index !== -1) {
                    state.images[index] = action.payload;
                }
            })
            .addCase(editRoomImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeRoomImage.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeRoomImage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.images.findIndex((image) => image.id === action.payload);
                if (index !== -1) {
                    state.images.splice(index, 1);
                }
            })
            .addCase(removeRoomImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
// Export actions and reducer
export default roomImagesSlice.reducer;