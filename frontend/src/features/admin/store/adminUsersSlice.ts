import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/shared/utils/api";
import type {
  User,
  UserFilters,
  UserAction,
} from "../components/UserManagement/UserManagement.types";

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetch",
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as { adminUsers: AdminUsersState };
    const { page, limit, filters } = state.adminUsers;
    try {
      const params: any = { page, limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const res = await api.get("/api/admin/users", { params });

      return {
        users: res.data.data.users as User[],
        pagination: res.data.data.pagination,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateStatus",
  async (
    { userId, action }: { userId: string; action: UserAction },
    { rejectWithValue }
  ) => {
    console.log("🔍 UpdateUserStatus thunk called:", { userId, action });

    try {
      if (!userId || userId === "undefined") {
        throw new Error(`Invalid user ID: ${userId}`);
      }

      if (!action) {
        throw new Error(`Invalid action: ${action}`);
      }

      const res = await api.put(`/api/admin/users/${userId}/action`, {
        action,
      });

      return { userId, action, response: res.data };
    } catch (err: any) {
      console.error("UpdateUserStatus error:", err);

      if (err.response) {
        console.error("Response error:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          url: err.response.config?.url,
        });

        return rejectWithValue(
          err.response.data?.message ||
            err.response.data?.error ||
            `HTTP ${err.response.status}: ${err.response.statusText}`
        );
      } else if (err.request) {
        console.error("Request error (no response):", err.request);
        return rejectWithValue(
          "No response from server. Check if backend is running."
        );
      } else {
        console.error("General error:", err.message);
        return rejectWithValue(err.message || "Unknown error occurred");
      }
    }
  }
);

interface AdminUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  page: number;
  limit: number;
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
  actionLoading: Record<string, boolean>;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
  filters: { search: "", status: "", sortBy: "name", sortOrder: "asc" },
  page: 1,
  limit: 10,
  pagination: { totalItems: 0, totalPages: 0, page: 1, pageSize: 10 },
  actionLoading: {},
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<UserFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    clearActionLoading(state, action: PayloadAction<string>) {
      delete state.actionLoading[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.pageSize;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        state.actionLoading[userId] = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId } = action.payload;
        delete state.actionLoading[userId];
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        delete state.actionLoading[userId];
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage, setLimit, clearActionLoading } =
  adminUsersSlice.actions;
export default adminUsersSlice.reducer;
