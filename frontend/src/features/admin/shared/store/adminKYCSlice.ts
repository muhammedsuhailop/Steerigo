import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminKYCService } from "../services/AdminKYCService";
import type { KYCRequest, KYCFilters, KYCAction } from "../types";

interface AdminKYCState {
  requests: KYCRequest[];
  selectedRequest: KYCRequest | null;
  loading: boolean;
  actionLoading: Record<string, boolean>;
  actionMessage: string | null;
  actionMessageType: "success" | "error" | null;
  error: string | null;
  filters: KYCFilters;
  page: number;
  limit: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

const initialState: AdminKYCState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  actionLoading: {},
  actionMessage: null,
  actionMessageType: null,
  error: null,
  filters: {
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "submittedAt",
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

const kycService = new AdminKYCService();

export const fetchKYCRequests = createAsyncThunk(
  "adminKYC/fetchRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { adminKYC: AdminKYCState };
      const { page, limit, filters } = state.adminKYC;

      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const result = await kycService.fetchKYCRequests({
        page,
        pageSize: limit,
        filters: sanitizedFilters,
      });

      return {
        requests: result.data.kycRequests,
        pagination: {
          currentPage: result.data.pagination.page,
          pageSize: result.data.pagination.pageSize,
          totalPages: result.data.pagination.totalPages,
          totalItems: result.data.pagination.totalItems,
        },
        appliedFilters: result.data.appliedFilters,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchKYCById = createAsyncThunk(
  "adminKYC/fetchById",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const result = await kycService.fetchKYCById(requestId);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateKYCStatus = createAsyncThunk(
  "adminKYC/updateStatus",
  async (
    {
      requestId,
      action,
      reason,
    }: { requestId: string; action: KYCAction; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await kycService.updateKYCStatus(
        requestId,
        action,
        reason
      );
      return { requestId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminKYCSlice = createSlice({
  name: "adminKYC",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<KYCFilters>>) => {
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
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
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
      // Fetch KYC requests
      .addCase(fetchKYCRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKYCRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
          pageSize: action.payload.pagination.pageSize,
        };
      })
      .addCase(fetchKYCRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch KYC by ID
      .addCase(fetchKYCById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKYCById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchKYCById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update KYC status
      .addCase(updateKYCStatus.pending, (state, action) => {
        const requestId = action.meta.arg.requestId;
        state.actionLoading[requestId] = true;
        state.error = null;
        state.actionMessage = null;
        state.actionMessageType = null;
      })
      .addCase(updateKYCStatus.fulfilled, (state, action) => {
        const { requestId, data, message } = action.payload;
        delete state.actionLoading[requestId];

        // Set success message
        state.actionMessage = message || "KYC status updated successfully";
        state.actionMessageType = "success";

        // Update request in the list
        const index = state.requests.findIndex(
          (req) => req.kycId === requestId
        );
        if (index !== -1) {
          state.requests[index] = { ...state.requests[index], ...data };
        }

        // Update selected request if it matches
        if (state.selectedRequest?.kycId === requestId) {
          state.selectedRequest = { ...state.selectedRequest, ...data };
        }
      })
      .addCase(updateKYCStatus.rejected, (state, action) => {
        const requestId = action.meta.arg.requestId;
        delete state.actionLoading[requestId];
        state.error = action.payload as string;

        // Set error message
        state.actionMessage = action.payload as string;
        state.actionMessageType = "error";
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
  clearSelectedRequest,
  clearActionMessage,
  setActionMessage,
} = adminKYCSlice.actions;

export default adminKYCSlice.reducer;
