import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  DriverSearchState,
  Driver,
  SearchCriteria,
  EstimatedFare,
} from "../types/driverSearch.types";

const initialState: DriverSearchState = {
  drivers: [],
  estimatedFare: null,
  searchCriteria: null,
  isLoading: false,
  error: null,
  totalFound: 0,
  searchedAt: null,
  requestGroupId: null,
};

export const driverSearchSlice = createSlice({
  name: "driverSearch",
  initialState,
  reducers: {
    // Set drivers from search results
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload;
    },
    // Set estimated fare
    setEstimatedFare: (state, action: PayloadAction<EstimatedFare>) => {
      state.estimatedFare = action.payload;
    },
    // Set search criteria
    setSearchCriteria: (state, action: PayloadAction<SearchCriteria>) => {
      state.searchCriteria = action.payload;
    },
    // Set total found count
    setTotalFound: (state, action: PayloadAction<number>) => {
      state.totalFound = action.payload;
    },
    // Set search timestamp
    setSearchedAt: (state, action: PayloadAction<string>) => {
      state.searchedAt = action.payload;
    },
    // Set requestGroupId
    setRequestGroupId: (state, action: PayloadAction<string | null>) => {
      state.requestGroupId = action.payload;
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Clear all search data
    clearSearch: (state) => {
      state.drivers = [];
      state.estimatedFare = null;
      state.searchCriteria = null;
      state.error = null;
      state.totalFound = 0;
      state.searchedAt = null;
      state.requestGroupId = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDrivers,
  setEstimatedFare,
  setSearchCriteria,
  setTotalFound,
  setSearchedAt,
  setRequestGroupId,
  setLoading,
  setError,
  clearSearch,
  clearError,
} = driverSearchSlice.actions;

// Selectors
export const selectDrivers = (state: { driverSearch: DriverSearchState }) =>
  state.driverSearch.drivers;

export const selectEstimatedFare = (state: {
  driverSearch: DriverSearchState;
}) => state.driverSearch.estimatedFare;

export const selectSearchCriteria = (state: {
  driverSearch: DriverSearchState;
}) => state.driverSearch.searchCriteria;

export const selectIsLoading = (state: { driverSearch: DriverSearchState }) =>
  state.driverSearch.isLoading;

export const selectError = (state: { driverSearch: DriverSearchState }) =>
  state.driverSearch.error;

export const selectTotalFound = (state: { driverSearch: DriverSearchState }) =>
  state.driverSearch.totalFound;

export const selectSearchedAt = (state: { driverSearch: DriverSearchState }) =>
  state.driverSearch.searchedAt;

export const selectRequestGroupId = (state: {
  driverSearch: DriverSearchState;
}) => state.driverSearch.requestGroupId;

export default driverSearchSlice.reducer;
