import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/shared/utils";
import { clearErrorsByContext } from "@/shared/components/ui/ErrorHandling/errorSlice";
import type {
  User,
  UserFilters,
  UserAction,
} from "../../user-management/components/UserManagement/UserManagement.types";

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetch",
  async (_: void, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(clearErrorsByContext("adminUsers/fetch"));
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
        success: boolean;
        message: string;
        data: {
          users: User[];
          pagination?: {
            totalItems: number;
            totalPages: number;
            page: number;
            pageSize: number;
          };
        };
      }>("/admin/users", { params });

      const users = Array.isArray(response.data?.users)
        ? response.data.users
        : [];
      const pagination = response.data?.pagination || {
        totalItems: users.length,
        totalPages: Math.ceil(users.length / limit),
        page: 1,
        pageSize: limit,
      };

      return {
        users,
        pagination: {
          totalItems: Math.max(0, pagination.totalItems),
          totalPages: Math.max(1, pagination.totalPages),
          page: Math.max(
            1,
            Math.min(pagination.page || 1, pagination.totalPages || 1)
          ),
          pageSize: Math.max(1, Math.min(pagination.pageSize || limit, 100)),
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.userMessage || error.message || "Failed to fetch users";
      const errorCode = error.code || "FETCH_USERS_ERROR";
      const errorStatus = error.status || error.response?.status;
      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        status: errorStatus,
        context: "adminUsers/fetch",
      });
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateStatus",
  async (
    { userId, action }: { userId: string; action: UserAction },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(clearErrorsByContext(`adminUsers/updateStatus/${userId}`));
      if (!userId || userId === "undefined") {
        throw new Error(`Invalid user ID: ${userId}`);
      }
      if (!action) {
        throw new Error(`Invalid action: ${action}`);
      }

      const response = await apiClient.put(`/admin/users/${userId}/action`, {
        action,
      });

      return {
        userId,
        action,
        message: response.message || "User status updated successfully",
      };
    } catch (error: any) {
      const errorMessage =
        error.userMessage || error.message || "Failed to update user status";
      const errorCode = error.code || "UPDATE_USER_ERROR";
      const errorStatus = error.status || error.response?.status;
      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        status: errorStatus,
        context: `adminUsers/updateStatus/${userId}`,
        userId,
      });
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
  pagination: { totalItems: 0, totalPages: 1, page: 1, pageSize: 10 },
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
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      const newPage = Math.max(1, action.payload);
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
        if (
          state.pagination.totalPages > 0 &&
          state.page > state.pagination.totalPages
        ) {
          state.page = state.pagination.totalPages;
        } else if (state.pagination.totalPages === 0) {
          state.page = 1;
        }
      })
      .addCase(fetchAdminUsers.rejected, (state) => {
        state.loading = false;
        state.pagination = {
          totalItems: 0,
          totalPages: 1,
          page: 1,
          pageSize: state.limit,
        };
        state.page = 1;
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        state.actionLoading[userId] = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, action: userAction } = action.payload;
        delete state.actionLoading[userId];
        const userIndex = state.users.findIndex((u) => u.userId === userId);
        if (userIndex !== -1) {
          // Update status based on action
          switch (userAction) {
            case "activate":
              state.users[userIndex].status = "Active";
              break;
            case "deactivate":
              state.users[userIndex].status = "Inactive";
              break;
            case "suspend":
              state.users[userIndex].status = "Suspended";
              break;
            case "block":
              state.users[userIndex].status = "Blocked";
              break;
          }
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
export const selectUsers = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.users;
export const selectLoading = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.loading;
export const selectFilters = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.filters;
export const selectPagination = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.pagination;
export const selectActionLoading = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.actionLoading;
export const selectIsActionLoading =
  (userId: string) => (state: { adminUsers: AdminUsersState }) =>
    state.adminUsers.actionLoading[userId] || false;
