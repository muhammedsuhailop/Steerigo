import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DriverFilters } from "../types";

// Local state management for admin drivers
// API calls are handled by adminApi (RTK Query)

interface AdminDriverState {
  // Filters and pagination state (local only)
  filters: DriverFilters;
  page: number;
  limit: number;
}

const initialState: AdminDriverState = {
  filters: {
    search: "",
    status: "",
    kycStatus: "",
    vehicleType: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  page: 1,
  limit: 10,
};

const adminDriverSlice = createSlice({
  name: "adminDrivers",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DriverFilters>>) => {
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
  adminDriverSlice.actions;
export default adminDriverSlice.reducer;

// Selectors
export const selectFilters = (state: { adminDrivers: AdminDriverState }) =>
  state.adminDrivers.filters;
export const selectPage = (state: { adminDrivers: AdminDriverState }) =>
  state.adminDrivers.page;
export const selectLimit = (state: { adminDrivers: AdminDriverState }) =>
  state.adminDrivers.limit;
