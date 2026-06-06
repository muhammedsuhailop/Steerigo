import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { KYCDetailRequest, KYCFilters } from "../types/kyc.interfaces";

// Local state management for admin KYC feature
// API calls are handled by adminApi (RTK Query)

interface AdminKYCState {
  // Filters and pagination state (local only)
  filters: KYCFilters;
  page: number;
  limit: number;
  selectedKYC: KYCDetailRequest | null; 
  viewModalOpen: boolean;
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
  selectedKYC: null, 
  viewModalOpen: false, 
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
    setSelectedKYC: (state, action: PayloadAction<KYCDetailRequest | null>) => {
      state.selectedKYC = action.payload;
    },
    setViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.viewModalOpen = action.payload;
    },
    clearSelectedKYC: (state) => {
      state.selectedKYC = null;
      state.viewModalOpen = false;
    },
  },
});

export const {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
  setSelectedKYC, 
  setViewModalOpen,
  clearSelectedKYC,
} = adminKYCSlice.actions;
export default adminKYCSlice.reducer;

// Selectors
export const selectFilters = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.filters;
export const selectPage = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.page;
export const selectLimit = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.limit;
export const selectSelectedKYC = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.selectedKYC;

export const selectViewModalOpen = (state: { adminKYC: AdminKYCState }) =>
  state.adminKYC.viewModalOpen;
