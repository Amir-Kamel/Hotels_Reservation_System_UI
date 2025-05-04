import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getUserDetail,
  getCurrentUser,
  updateUser,
  deleteUser,
  registerUser,
  registerUserForAdmin,
  updateCurrentUser,
  getCurrentAdmin,
  editCurrentAdmin,
} from "../../services/api";

export const fetchUsers = createAsyncThunk(
  "accounts/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();
      return response.data;
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserDetail = createAsyncThunk(
  "accounts/fetchUserDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserDetail(id);
      return response.data;
    } catch (error) {
      console.error("Fetch User Detail Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user detail"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "accounts/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data;
    } catch (error) {
      console.error("Fetch Current User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current user"
      );
    }
  }
);

export const fetchCurrentAdmin = createAsyncThunk(
  "accounts/fetchCurrentAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentAdmin();
      return response.data;
    } catch (error) {
      console.error("Fetch Current User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch current user"
      );
    }
  }
);

export const editUser = createAsyncThunk(
  "accounts/editUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, data);
      return response.data;
    } catch (error) {
      console.error("Edit User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const removeUser = createAsyncThunk(
  "accounts/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error) {
      console.error("Delete User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);
export const errorResponse = {};
export const createUser = createAsyncThunk(
  "accounts/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUser(data);
      return response.data;
    } catch (error) {
      console.error("Register User", error.response.data);
      return rejectWithValue(error.response?.data|| "Failed to register user");
    }
  }
);

export const createUserForAdmin = createAsyncThunk(
  "accounts/createUserForAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUserForAdmin(data);
      return response.data;
    } catch (error) {
      console.error("Register User Error:", error.response.data);
      return rejectWithValue(
        error.response.data || "Failed to register user"
      );
    }
  }
);

export const editCurrentUser = createAsyncThunk(
  "accounts/editCurrentUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateCurrentUser(data);
      return response.data;
    } catch (error) {
      console.error("Update Current User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update current user"
      );
    }
  }
);

export const editCurrentAdmindata = createAsyncThunk(
  "accounts/editCurrentAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await editCurrentAdmin(data);
      return response.data;
    } catch (error) {
      console.error("Update Current User Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update current user"
      );
    }
  }
);

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  formError:null,
  userDetail: null,
};

// Slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user detail
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user detail
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current admin detail
      .addCase(fetchCurrentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(fetchCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // edit current admin detail
      .addCase(editCurrentAdmindata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCurrentAdmindata.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(editCurrentAdmindata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit user
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove user
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create new user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create new user for admin
      .addCase(createUserForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUserForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.formError = action.payload;
      })

      // Edit current user
      .addCase(editCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
      })
      .addCase(editCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default accountsSlice.reducer;
export const { clearError } = accountsSlice.actions;
