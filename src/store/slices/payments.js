import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios_conf.js';
import { 
  paymentData,
  getUserBookings,
} from "../../services/api";


// Fetch single payment details
// In your payments.js slice
export const fetchPaymentDetail = createAsyncThunk(
  "payments/fetchPaymentDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentData(id);
      console.log("Payment Detail Response:", response);
      
      // Validate response data structure
      if (!response.data || !response.data.hotel) {
        return rejectWithValue("Invalid payment data received");
      }
      
      return response.data;
    } catch (error) {
      console.error('Fetch Payment Detail Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment detail");
    }
  }
);

export const fetchUserPayments = createAsyncThunk(
  "payments/fetchUserPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBookings();
      console.log("User bookings response:", response);
      return response.data;
    } catch (error) {
      console.error('Fetch User Payments Error:', error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user payments"
      );
    }
  }
);

export const submitClientInfo = createAsyncThunk(
  'payments/submitClientInfo',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments/client-info/', clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const submitPaymentMethod = createAsyncThunk(
  'payments/submitPaymentMethod',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments/payment-method/', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const initialState = {
  clientInfoStatus: 'idle', 
  paymentDetail: [],
  paymentMethodStatus: 'idle',
  paymentData: null,
  error: null,
  paymentSuccess: null,
  payments: [], // Add this line
  loading: false // Add this line if not already present
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.clientInfoStatus = 'idle';
      state.paymentMethodStatus = 'idle';
      state.error = null;
      state.paymentSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object'
          ? (action.payload.message || JSON.stringify(action.payload))
          : action.payload || action.error.message;
      })

      .addCase(fetchPaymentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetail = action.payload;
      })
      .addCase(fetchPaymentDetail.rejected, (state, action) => {
        state.loading = false;
        // Make sure error is always stored as a string
        state.error = typeof action.payload === 'object' 
          ? (action.payload.message || JSON.stringify(action.payload)) 
          : action.payload || action.error.message;
      })

      .addCase(submitClientInfo.pending, (state) => {
        state.clientInfoStatus = 'loading';
        state.error = null;
      })
      .addCase(submitClientInfo.fulfilled, (state, action) => {
        state.clientInfoStatus = 'succeeded';
        state.paymentData = action.payload;
        state.error = null;
      })
      .addCase(submitClientInfo.rejected, (state, action) => {
        state.clientInfoStatus = 'failed';
        state.error = action.payload || 'Failed to submit client information';
      })

      .addCase(submitPaymentMethod.pending, (state) => {
        state.paymentMethodStatus = 'loading';
        state.error = null;
      })
      .addCase(submitPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethodStatus = 'succeeded';
        state.paymentSuccess = action.payload;
        state.error = null;
      })
      .addCase(submitPaymentMethod.rejected, (state, action) => {
        state.paymentMethodStatus = 'failed';
        state.error = action.payload || 'Failed to process payment';
      });
      
      
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;




