import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserFilters } from "../../user/user-management/components/UserManagement";

// Local state management for admin users feature
// API calls are handled by adminApi (RTK Query)

interface AdminUsersState {
  // Filters and pagination state (local only)
  filters: UserFilters;
  page: number;
  limit: number;
}

const initialState: AdminUsersState = {
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
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<UserFilters>>) {
      const newFilters = { ...state.filters, ...action.payload };

      // Validate date range
      if (newFilters.dateFrom && newFilters.dateTo) {
        const fromDate = new Date(newFilters.dateFrom);
        const toDate = new Date(newFilters.dateTo);
        if (fromDate > toDate) {
          newFilters.dateTo = "";
        }
      }

      state.filters = newFilters;
      state.page = 1; // Reset to first page on filter change
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },

    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.max(1, Math.min(action.payload, 100));
      state.page = 1; // Reset to first page on limit change
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
});

export const { setFilters, setPage, setLimit, resetFilters } =
  adminUsersSlice.actions;
export default adminUsersSlice.reducer;

// Selectors
export const selectFilters = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.filters;
export const selectPage = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.page;
export const selectLimit = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.limit;
