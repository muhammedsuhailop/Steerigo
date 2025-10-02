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
  actionMessage: string | null;
  actionMessageType: "success" | "error" | null;
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
  actionMessage: null,
  actionMessageType: null,
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
    clearActionMessage: (state) => {
      state.actionMessage = null;
      state.actionMessageType = null;
    },
    setActionMessage: (
      state,
      action: PayloadAction<{ message: string; type: "success" | "error" }>
    ) => {
      state.actionMessage = action.payload.message;
      state.actionMessageType = action.payload.type;
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

        const data = action.payload;

        state.selectedDriver = {
          driverId: data.id,
          name: data.user?.name || "",
          email: data.user?.email || "",
          mobile: data.user?.mobile || "",
          status: data.driver?.status || "InReview",
          kycStatus: data.driver?.kycStatus || "Pending",
          createdAt: data.driver?.createdAt || "",
          address: data.user?.address || "",
          pinCode: data.user?.pinCode || "",
          state: data.user?.state || "",
          lastRide: data.driver?.statistics?.lastRideDate || null,
          totalRides: data.driver?.statistics?.totalRides || 0,
          rating: 0, // ToDo
          profileImage: undefined, // ToDo:
          licenseNumber: data.driver?.licenseNumber || "",
          licenseIssueDate: data.driver?.licenseIssueDate || "",
          licenseExpiryDate: data.driver?.licenseExpiryDate || "",
          eligibleVehicleType: data.driver?.eligibleVehicleType || [],
          eligibleGearType: data.driver?.eligibleGearType || [],
          kycDocs: Array.isArray(data.kycDocuments)
            ? data.kycDocuments.map((doc: any) => ({
                id: doc.id,
                driverId: doc.driverId,
                documentType: doc.documentType,
                documentNumber: doc.documentNumber,
                issueDate: doc.issueDate,
                expiryDate: doc.expiryDate,
                documentImageUrls: doc.documentImageUrls || [],
                isVerified: doc.isVerified,
                comments: doc.comments,
                submittedAt: doc.submittedAt,
              }))
            : [],
        };
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
        const { driverId, data, message } = action.payload;
        delete state.actionLoading[driverId];

        // Set success message
        state.actionMessage = message || "Driver status updated successfully";
        state.actionMessageType = "success";

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

        state.actionMessage = action.payload as string;
        state.actionMessageType = "error";
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
  clearActionMessage,
  setActionMessage,
} = adminDriverSlice.actions;

export default adminDriverSlice.reducer;
