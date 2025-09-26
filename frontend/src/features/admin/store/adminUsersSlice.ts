import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminUsersState, AdminUser } from '../types/admin.types';

// Initial state with proper defaults
const initialState: AdminUsersState = {
  users: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalUsers: 0, // Make sure this is initialized
  searchQuery: '',
  roleFilter: '',
  statusFilter: '',
};

// Async thunks for existing functionality
export const fetchAdminUsersAsync = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (params: { search?: string; role?: string; status?: string; page?: number; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', (params.limit || 10).toString());

    const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
);

export const updateAdminUserAsync = createAsyncThunk(
  'adminUsers/updateUser',
  async (payload: { id: string; name?: string; role?: string; status?: string; isVerified?: boolean }) => {
    const response = await fetch(`/api/admin/users/${payload.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }
);

export const deleteAdminUserAsync = createAsyncThunk(
  'adminUsers/deleteUser',
  async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return userId;
  }
);

// Admin users slice
const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    // Maintain existing action names for compatibility
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.users = action.payload || [];
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload || 1;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload || 0;
    },
    setTotalUsers: (state, action: PayloadAction<number>) => {
      state.totalUsers = action.payload || 0;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload || '';
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload || '';
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload || '';
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.roleFilter = '';
      state.statusFilter = '';
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchAdminUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.users = action.payload.data?.users || [];
          state.totalUsers = action.payload.data?.totalCount || 0;
          state.currentPage = action.payload.data?.currentPage || 1;
          state.totalPages = action.payload.data?.totalPages || 0;
        }
      })
      .addCase(fetchAdminUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });

    // Update user
    builder
      .addCase(updateAdminUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const updatedUser = action.payload;
          const index = state.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        }
      })
      .addCase(updateAdminUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update user';
      });

    // Delete user
    builder
      .addCase(deleteAdminUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAdminUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const deletedUserId = action.payload;
          state.users = state.users.filter(user => user.id !== deletedUserId);
          state.totalUsers = Math.max(0, state.totalUsers - 1);
        }
      })
      .addCase(deleteAdminUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

// Export actions (maintain compatibility with existing components)
export const {
  setLoading,
  setError,
  setUsers,
  setCurrentPage,
  setTotalPages,
  setTotalUsers,
  setSearchQuery,
  setRoleFilter,
  setStatusFilter,
  clearError,
  clearFilters,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
