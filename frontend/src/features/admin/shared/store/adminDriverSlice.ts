import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminDriverService } from "../services/AdminDriverService";
import type {
  Driver,
  DriverFilters,
  DriverAction,
  DriverPagination,
} from "../types";

interface AdminDriverState {
  drivers: Driver[];
  selectedDriver: Driver | null;
  loading: boolean;
  actionLoading: Record<string, boolean>;
  error: string | null;
  filters: DriverFilters;
  page: number;
  limit: number;
  pagination: DriverPagination;
}

const initialState: AdminDriverState = {
  drivers: [],
  selectedDriver: null,
  loading: false,
  actionLoading: {},
  error: null,
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
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  },
};

const driverService = new AdminDriverService();

export const fetchAdminDrivers = createAsyncThunk(
  "adminDrivers/fetchDrivers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { adminDrivers: AdminDriverState };
      const { page, limit, filters } = state.adminDrivers;

      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const result = await driverService.fetchDrivers({
        page,
        pageSize: limit,
        filters: sanitizedFilters,
      });

      return result.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDriverById = createAsyncThunk(
  "adminDrivers/fetchDriverById",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const result = await driverService.fetchDriverById(driverId);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDriverStatus = createAsyncThunk(
  "adminDrivers/updateDriverStatus",
  async (
    {
      driverId,
      action,
      reason,
    }: { driverId: string; action: DriverAction; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await driverService.updateDriverStatus(
        driverId,
        action,
        reason
      );
      return { driverId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminDriverSlice = createSlice({
  name: "adminDrivers",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DriverFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset page when limit changes
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
    clearActionLoading: (state, action: PayloadAction<string>) => {
      delete state.actionLoading[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedDriver: (state) => {
      state.selectedDriver = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch drivers
      .addCase(fetchAdminDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.drivers;

        state.pagination = {
          currentPage: action.payload.pagination.page,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
          pageSize: action.payload.pagination.pageSize,
        };
      })
      .addCase(fetchAdminDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch driver by ID
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDriver = action.payload;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update driver status
      .addCase(updateDriverStatus.pending, (state, action) => {
        const driverId = action.meta.arg.driverId;
        state.actionLoading[driverId] = true;
        state.error = null;
      })
      .addCase(updateDriverStatus.fulfilled, (state, action) => {
        const { driverId, data } = action.payload;
        delete state.actionLoading[driverId];

        // Update driver in the list
        const index = state.drivers.findIndex(
          (driver) => driver.driverId === driverId
        );
        if (index !== -1) {
          state.drivers[index] = { ...state.drivers[index], ...data };
        }

        // Update selected driver if it matches
        if (state.selectedDriver?.driverId === driverId) {
          state.selectedDriver = { ...state.selectedDriver, ...data };
        }
      })
      .addCase(updateDriverStatus.rejected, (state, action) => {
        const driverId = action.meta.arg.driverId;
        delete state.actionLoading[driverId];
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setPage,
  setLimit,
  resetFilters,
  clearActionLoading,
  clearError,
  clearSelectedDriver,
} = adminDriverSlice.actions;

export default adminDriverSlice.reducer;
