import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../config/axios_conf";

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/accounts/login/', {
        username,
        password,
      });
      console.log('Login Response:', response.data);
      const { access, refresh, user } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user)); 
      return { access, refresh, user };
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('access') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.non_field_errors[0] : 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

