// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { 
//   getAllPayments,
//   createPayment,
//   getPayment,
//   updatePayment,
//   deletePayment,
//   processPayment,
//   refundPayment,
//   createPaymentForReservation,
//   getAllPaymentSettings,
//   createPaymentSetting,
//   getPaymentSetting,
//   updatePaymentSetting,
//   deletePaymentSetting
// } from "../../services/api";

// // Fetch all payments
// export const fetchPayments = createAsyncThunk(
//   "payments/fetchPayments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAllPayments();
//       return response;
//     } catch (error) {
//       console.error('Fetch Payments Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
//     }
//   }
// );

// // Create a new payment
// export const addPayment = createAsyncThunk(
//   "payments/addPayment",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createPayment(data);
//       return response;
//     } catch (error) {
//       console.error('Create Payment Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to create payment");
//     }
//   }
// );

// // Fetch single payment details
// export const fetchPaymentDetail = createAsyncThunk(
//   "payments/fetchPaymentDetail",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getPayment(id);
//       return response;
//     } catch (error) {
//       console.error('Fetch Payment Detail Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch payment detail");
//     }
//   }
// );

// // Process a payment
// export const processSinglePayment = createAsyncThunk(
//   "payments/processSinglePayment",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await processPayment(id);
//       return response;
//     } catch (error) {
//       console.error('Process Payment Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to process payment");
//     }
//   }
// );

// // Refund a payment
// export const refundSinglePayment = createAsyncThunk(
//   "payments/refundSinglePayment",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await refundPayment(id);
//       return response;
//     } catch (error) {
//       console.error('Refund Payment Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to refund payment");
//     }
//   }
// );

// // Create payment for reservation
// export const createReservationPayment = createAsyncThunk(
//   "payments/createReservationPayment",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createPaymentForReservation(data);
//       return response;
//     } catch (error) {
//       console.error('Create Reservation Payment Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to create reservation payment");
//     }
//   }
// );

// // Fetch all payment settings
// export const fetchPaymentSettings = createAsyncThunk(
//   "payments/fetchPaymentSettings",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAllPaymentSettings();
//       return response;
//     } catch (error) {
//       console.error('Fetch Payment Settings Error:', error);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch payment settings");
//     }
//   }
// );

// // Initial State
// const initialState = {
//   payments: [],
//   paymentDetail: null,
//   paymentSettings: [],
//   loading: false,
//   error: null,
// };

// // Slice
// const paymentsSlice = createSlice({
//   name: "payments",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch all payments
//       .addCase(fetchPayments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPayments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payments = action.payload;
//       })
//       .addCase(fetchPayments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Add a payment
//       .addCase(addPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payments.push(action.payload);
//       })
//       .addCase(addPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch single payment detail
//       .addCase(fetchPaymentDetail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPaymentDetail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentDetail = action.payload;
//       })
//       .addCase(fetchPaymentDetail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Process a payment
//       .addCase(processSinglePayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(processSinglePayment.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(processSinglePayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Refund a payment
//       .addCase(refundSinglePayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refundSinglePayment.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(refundSinglePayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Create payment for reservation
//       .addCase(createReservationPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createReservationPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payments.push(action.payload);
//       })
//       .addCase(createReservationPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch payment settings
//       .addCase(fetchPaymentSettings.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPaymentSettings.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentSettings = action.payload;
//       })
//       .addCase(fetchPaymentSettings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default paymentsSlice.reducer;
