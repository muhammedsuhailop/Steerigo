import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";

// TYPE DEFINITIONS
export interface AdminUser {
  id: string;
  userId?: string;
  name: string;
  email: string;
  mobile?: string;
  status:
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Pending Verification"
    | "Blocked";
  role: string;
  totalBookings: number;
  totalSpent: number;
  lastBooked?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface AdminDriver {
  id: string;
  driverId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  status: string;
  kycStatus: string;
  licenceCategory: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
  totalRides: number;
  totalEarnings: number;
  rating: number;
  lastRideDate: string | null;
  profileImage?: string;
  createdAt: string;
}

// KYC TYPES
export interface KYCDocument {
  id: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string | null;
  verificationStatus: "InReview" | "Approved" | "Rejected";
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface KYCDriver {
  driverId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  driverStatus: "Active" | "Inactive" | "Suspended";
}

export interface KYCRequest {
  kyc: KYCDocument;
  driver: KYCDriver;
}

export interface KYCPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface KYCListResponse {
  success: boolean;
  message: string;
  data: {
    kycDocuments: KYCRequest[];
    pagination: KYCPagination;
  };
}

export interface KYCDetailResponse {
  success: boolean;
  message: string;
  data: KYCRequest;
}

export interface KYCUpdateResponse {
  success: boolean;
  message: string;
  data?: KYCRequest;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  pageSize?: number;
}

interface PaginationResponse {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

// API DEFINITION

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminUsers", "AdminDrivers", "KYCRequests", "AdminStats"],
  endpoints: (builder) => ({
    // USER MANAGEMENT

    getAllUsers: builder.query<
      {
        success: boolean;
        data: { users: AdminUser[]; pagination: PaginationResponse };
      },
      {
        page?: number;
        limit?: number;
        pageSize?: number;
        status?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => {
        const queryParams: any = {};
        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.pageSize = params.limit;
        if (params.pageSize) queryParams.pageSize = params.pageSize;
        if (params.status) queryParams.status = params.status;
        if (params.search) queryParams.search = params.search;
        if (params.sortBy) queryParams.sortBy = params.sortBy;
        if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
        if (params.dateTo) queryParams.dateTo = params.dateTo;
        return {
          url: "/admin/users",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id, userId }) => ({
                type: "AdminUsers" as const,
                id: userId || id,
              })),
              { type: "AdminUsers", id: "LIST" },
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; message: string; data?: AdminUser },
      {
        userId: string;
        action: "activate" | "deactivate" | "suspend" | "block" | "verify";
      }
    >({
      query: ({ userId, action }) => ({
        url: `/admin/users/${userId}/action`,
        method: "PUT",
        data: { action },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "AdminUsers", id: userId },
        { type: "AdminUsers", id: "LIST" },
      ],
    }),

    // DRIVER MANAGEMENT

    getAllDrivers: builder.query<
      {
        success: boolean;
        data: { drivers: AdminDriver[]; pagination: PaginationResponse };
      },
      {
        page?: number;
        limit?: number;
        pageSize?: number;
        status?: string;
        kycStatus?: string;
        search?: string;
        vehicleType?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => {
        const queryParams: any = {};
        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.pageSize = params.limit;
        if (params.pageSize) queryParams.pageSize = params.pageSize;
        if (params.status) queryParams.status = params.status;
        if (params.kycStatus) queryParams.kycStatus = params.kycStatus;
        if (params.search) queryParams.search = params.search;
        if (params.vehicleType) queryParams.vehicleType = params.vehicleType;
        if (params.sortBy) queryParams.sortBy = params.sortBy;
        if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
        if (params.dateTo) queryParams.dateTo = params.dateTo;
        return {
          url: "/admin/drivers",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.drivers.map(({ id, driverId }) => ({
                type: "AdminDrivers" as const,
                id: driverId || id,
              })),
              { type: "AdminDrivers", id: "LIST" },
            ]
          : [{ type: "AdminDrivers", id: "LIST" }],
    }),

    getDriverById: builder.query<
      { success: boolean; data: AdminDriver },
      string
    >({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "AdminDrivers", id: driverId },
      ],
    }),

    updateDriverStatus: builder.mutation<
      { success: boolean; message: string; data: AdminDriver },
      {
        driverId: string;
        action:
          | "activate"
          | "deactivate"
          | "suspend"
          | "block"
          | "approve"
          | "reject";
        reason?: string;
      }
    >({
      query: ({ driverId, action, reason }) => ({
        url: `/admin/drivers/${driverId}/action`,
        method: "PUT",
        data: { action, reason },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "AdminDrivers", id: driverId },
        { type: "AdminDrivers", id: "LIST" },
        { type: "KYCRequests", id: "LIST" },
      ],
    }),

    getDriverStats: builder.query<
      {
        success: boolean;
        data: {
          totalDrivers: number;
          activeDrivers: number;
          pendingApproval: number;
          suspendedDrivers: number;
        };
      },
      void
    >({
      query: () => ({
        url: "/admin/drivers/stats",
        method: "GET",
      }),
      providesTags: [{ type: "AdminStats", id: "DRIVER_STATS" }],
    }),

    // KYC MANAGEMENT 

    getKYCRequests: builder.query<
      KYCListResponse,
      {
        page?: number;
        limit?: number;
        pageSize?: number;
        status?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => {
        const queryParams: any = {};
        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.pageSize = params.limit;
        if (params.pageSize) queryParams.pageSize = params.pageSize;
        if (params.status) queryParams.status = params.status;
        if (params.search) queryParams.search = params.search;
        if (params.sortBy) queryParams.sortBy = params.sortBy;
        if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params.dateFrom) queryParams.dateFrom = params.dateFrom;
        if (params.dateTo) queryParams.dateTo = params.dateTo;
        return {
          url: "/admin/drivers/kyc-requests",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.kycDocuments.map(({ kyc }) => ({
                type: "KYCRequests" as const,
                id: kyc.id,
              })),
              { type: "KYCRequests", id: "LIST" },
            ]
          : [{ type: "KYCRequests", id: "LIST" }],
    }),

    getKYCById: builder.query<KYCDetailResponse, string>({
      query: (requestId) => ({
        url: `/admin/drivers/kyc-requests/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "KYCRequests", id: requestId },
      ],
    }),

    updateKYCStatus: builder.mutation<
      KYCUpdateResponse,
      {
        requestId: string;
        action: "approve" | "reject";
        status?: "approved" | "rejected";
        reason?: string;
      }
    >({
      query: ({ requestId, action, status, reason }) => ({
        url: `/admin/kyc-requests/${requestId}/status`,
        method: "PATCH",
        data: {
          action,
          status: status || (action === "approve" ? "approved" : "rejected"),
          reason,
        },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "KYCRequests", id: requestId },
        { type: "KYCRequests", id: "LIST" },
        { type: "AdminDrivers", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // User Management
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  // Driver Management
  useGetAllDriversQuery,
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
  useGetDriverStatsQuery,
  // KYC Management
  useGetKYCRequestsQuery,
  useGetKYCByIdQuery,
  useUpdateKYCStatusMutation,
} = adminApi;
