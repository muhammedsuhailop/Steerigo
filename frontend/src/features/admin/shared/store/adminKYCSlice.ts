import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { KYCFilters } from "../types";

// Local state management for admin KYC feature
// API calls are handled by adminApi (RTK Query)

interface AdminKYCState {
  // Filters and pagination state (local only)
  filters: KYCFilters;
  page: number;
  limit: number;
}

const initialState: AdminKYCState = {
  filters: {
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  page: 1,
  limit: 10,
};

const adminKYCSlice = createSlice({
  name: "adminKYC",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<KYCFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = Math.max(1, action.payload);
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = Math.max(1, Math.min(action.payload, 100));
      state.page = 1; // Reset page when limit changes
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
});

export const { setFilters, setPage, setLimit, resetFilters } =
  adminKYCSlice.actions;
export default adminKYCSlice.reducer;

// Selectors
export const selectFilters = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.filters;
export const selectPage = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.page;
export const selectLimit = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.limit;
