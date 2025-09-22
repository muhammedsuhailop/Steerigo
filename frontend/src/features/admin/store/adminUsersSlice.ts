import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/shared/utils/api";  // ✅ Now properly exported
import type {
  User,
  UserFilters,
  UserAction,
} from "../components/UserManagement/UserManagement.types";

// Enhanced async thunk with proper error handling
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetch",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { adminUsers: AdminUsersState };
      const { page, limit, filters } = state.adminUsers;

      const params: any = {
        page: Math.max(1, page),
        pageSize: Math.max(1, Math.min(limit, 100)),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }
      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }

      const response = await apiClient.get<{
        users: User[];
        pagination: {
          totalItems: number;
          totalPages: number;
          page: number;
          pageSize: number;
        };
      }>("/api/admin/users", { params });

      // Validate response data
      const users = Array.isArray(response.users) ? response.users : [];
      const pagination = response.pagination || {
        totalItems: 0,
        totalPages: 0,
        page: 1,
        pageSize: limit
      };

      return {
        users,
        pagination: {
          totalItems: Math.max(0, pagination.totalItems),
          totalPages: Math.max(0, pagination.totalPages),
          page: Math.max(1, Math.min(pagination.page, pagination.totalPages || 1)),
          pageSize: Math.max(1, Math.min(pagination.pageSize, 100))
        },
      };
    } catch (error) {
      // API client handles error display, we just need to handle the rejection
      return rejectWithValue(error);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateStatus",
  async (
    { userId, action }: { userId: string; action: UserAction },
    { rejectWithValue }
  ) => {
    try {
      if (!userId || userId === "undefined") {
        throw new Error(`Invalid user ID: ${userId}`);
      }

      if (!action) {
        throw new Error(`Invalid action: ${action}`);
      }

      const response = await apiClient.put<{
        success: boolean;
        message: string;
        user: User;
      }>(`/api/admin/users/${userId}/action`, { action });

      return { 
        userId, 
        action, 
        user: response.user,
        message: response.message 
      };
    } catch (error) {
      // API client handles error display, we just need to handle the rejection
      return rejectWithValue(error);
    }
  }
);

interface AdminUsersState {
  users: User[];
  loading: boolean;
  actionLoading: Record<string, boolean>;
  filters: UserFilters;
  page: number;
  limit: number;
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  actionLoading: {},
  filters: {
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
  },
  page: 1,
  limit: 10,
  pagination: { totalItems: 0, totalPages: 0, page: 1, pageSize: 10 },
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<UserFilters>>) {
      const newFilters = { ...state.filters, ...action.payload };

      if (newFilters.dateFrom && newFilters.dateTo) {
        const fromDate = new Date(newFilters.dateFrom);
        const toDate = new Date(newFilters.dateTo);

        if (fromDate > toDate) {
          newFilters.dateTo = "";
        }
      }

      state.filters = newFilters;
      state.page = 1; // Reset to first page when filters change
    },

    setPage(state, action: PayloadAction<number>) {
      const newPage = Math.max(1, action.payload);

      // Only update page if it's within valid bounds
      if (state.pagination.totalPages === 0) {
        state.page = 1;
      } else {
        state.page = Math.min(newPage, state.pagination.totalPages);
      }
    },

    setLimit(state, action: PayloadAction<number>) {
      const newLimit = Math.max(1, Math.min(action.payload, 100));
      state.limit = newLimit;
      state.page = 1;
    },

    clearActionLoading(state, action: PayloadAction<string>) {
      delete state.actionLoading[action.payload];
    },

    resetFilters(state) {
      state.filters = {
        search: "",
        status: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        dateFrom: "",
        dateTo: "",
      };
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;

        // Validate current page against new pagination data
        if (state.pagination.totalPages > 0 && state.page > state.pagination.totalPages) {
          state.page = state.pagination.totalPages;
        } else if (state.pagination.totalPages === 0) {
          state.page = 1;
        }
      })
      .addCase(fetchAdminUsers.rejected, (state) => {
        state.loading = false;
        // Reset pagination on error
        state.pagination = { totalItems: 0, totalPages: 0, page: 1, pageSize: state.limit };
        state.page = 1;
      })

      // Update User Status
      .addCase(updateUserStatus.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        state.actionLoading[userId] = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        delete state.actionLoading[userId];

        // Update the user in the list
        const userIndex = state.users.findIndex(u => u.userId === userId);
        if (userIndex !== -1 && user) {
          state.users[userIndex] = user;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        delete state.actionLoading[userId];
      });
  },
});

export const {
  setFilters,
  setPage,
  setLimit,
  clearActionLoading,
  resetFilters,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;

// Selectors
export const selectUsers = (state: { adminUsers: AdminUsersState }) => state.adminUsers.users;
export const selectLoading = (state: { adminUsers: AdminUsersState }) => state.adminUsers.loading;
export const selectFilters = (state: { adminUsers: AdminUsersState }) => state.adminUsers.filters;
export const selectPagination = (state: { adminUsers: AdminUsersState }) => state.adminUsers.pagination;
export const selectActionLoading = (state: { adminUsers: AdminUsersState }) => state.adminUsers.actionLoading;
export const selectIsActionLoading = (userId: string) => (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.actionLoading[userId] || false;