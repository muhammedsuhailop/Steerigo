import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { KYCDetailResponseData } from "../types/kyc.interfaces";
import {
  AdminDriver,
  AdminUser,
  KYCListResponse,
  KYCUpdateResponse,
  PaginationResponse,
} from "../types/admin.interfaces";
import {
  AdminDriverProfileResponse,
  DriverProfileAction,
  KYCVerificationStatus,
} from "../types/adminDriverProfile.types";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "AdminUsers",
    "AdminDrivers",
    "KYCRequests",
    "AdminStats",
    "DriverProfile",
  ],
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
        action: "Active" | "Inactive" | "Suspended";
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

    getDriverById: builder.query<AdminDriverProfileResponse, string>({
      query: (driverId) => {
        return {
          url: `/admin/drivers/${driverId}/profile`,
          method: "GET",
        };
      },
      providesTags: (result, error, driverId) => [
        { type: "DriverProfile", id: driverId },
        { type: "AdminDrivers", id: driverId },
      ],
    }),

    updateDriverStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      {
        driverId: string;
        action: DriverProfileAction;
        reason?: string;
      }
    >({
      query: ({ driverId, action, reason }) => ({
        url: `/admin/drivers/${driverId}/action`,
        method: "PUT",
        data: { action, reason },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "DriverProfile", id: driverId },
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

    getKYCById: builder.query<KYCDetailResponseData, string>({
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
        action: "Approved" | "Rejected" | "Expired";
        status?: "approved" | "rejected";
        reason?: string;
      }
    >({
      query: ({ requestId, action, status, reason }) => ({
        url: `/admin/drivers/kyc-requests/${requestId}/status`,
        method: "PATCH",
        data: {
          verificationStatus: action,
          status: status || (action === "Approved" ? "approved" : "rejected"),
          comments: reason,
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

// Export hooks
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

export type {
  AdminDriver,
  AdminUser,
  PaginationResponse,
} from "../types/admin.interfaces";
export type {
  AdminDriverProfileResponse,
  DriverProfileAction,
  KYCVerificationStatus,
} from "../types/adminDriverProfile.types";
