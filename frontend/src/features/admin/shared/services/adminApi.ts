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
} from "../types/adminDriverProfile.types";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { UserAction } from "../../user/user-management/components/UserManagement";

type QueryParams = Record<string, any> | undefined;

const buildParams = (params?: QueryParams) => {
  if (!params) return undefined;
  const out: Record<string, any> = {};

  if (params.page) out.page = params.page;
  if (params.limit) out.pageSize = params.limit;
  if (params.pageSize && !params.limit) out.pageSize = params.pageSize;

  [
    "status",
    "kycStatus",
    "search",
    "vehicleType",
    "sortBy",
    "sortOrder",
    "dateFrom",
    "dateTo",
  ].forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== "")
      out[k] = params[k];
  });

  return Object.keys(out).length ? out : undefined;
};

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
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.USERS,
        method: "GET",
        params: buildParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map((u) => ({
                type: "AdminUsers" as const,
                id: u.userId ?? u.id,
              })),
              { type: "AdminUsers", id: "LIST" },
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; message: string; data?: AdminUser },
      { userId: string; action: UserAction }
    >({
      query: ({ userId, action }) => ({
        url: `${API_ENDPOINTS.ADMIN.USERS}/${userId}/action`,
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
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.DRIVERS,
        method: "GET",
        params: buildParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.drivers.map((d) => ({
                type: "AdminDrivers" as const,
                id: d.driverId,
              })),
              { type: "AdminDrivers", id: "LIST" },
            ]
          : [{ type: "AdminDrivers", id: "LIST" }],
    }),

    getDriverById: builder.query<AdminDriverProfileResponse, string>({
      query: (driverId) => ({
        url: `${API_ENDPOINTS.ADMIN.DRIVERS}/${driverId}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "DriverProfile", id: driverId },
        { type: "AdminDrivers", id: driverId },
      ],
    }),

    updateDriverStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { driverId: string; action: DriverProfileAction; reason?: string }
    >({
      query: ({ driverId, action, reason }) => ({
        url: `${API_ENDPOINTS.ADMIN.DRIVERS}/${driverId}/action`,
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
        url: `${API_ENDPOINTS.ADMIN.DRIVERS}/stats`,
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
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.KYC,
        method: "GET",
        params: buildParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.kycDocuments.map((doc) => ({
                type: "KYCRequests" as const,
                id: doc.kyc.id,
              })),
              { type: "KYCRequests", id: "LIST" },
            ]
          : [{ type: "KYCRequests", id: "LIST" }],
    }),

    getKYCById: builder.query<KYCDetailResponseData, string>({
      query: (requestId) => ({
        url: `${API_ENDPOINTS.ADMIN.KYC}/${requestId}`,
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
        url: `${API_ENDPOINTS.ADMIN.KYC}/${requestId}/status`,
        method: "PATCH",
        data: {
          verificationStatus: action,
          status: status ?? (action === "Approved" ? "approved" : "rejected"),
          comments: reason,
        },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "KYCRequests", id: requestId },
        { type: "KYCRequests", id: "LIST" },
        { type: "AdminDrivers", id: "LIST" },
      ],
    }),

    updateDriverKYCStatus: builder.mutation<
      { success: boolean; message: string; data?: any },
      {
        driverId: string;
        kycStatus: "Approved" | "InReview" | "Rejected" | "InReview";
      }
    >({
      query: ({ driverId, kycStatus }) => ({
        url: `${API_ENDPOINTS.ADMIN.DRIVERS}/${driverId}/kyc-status/update`,
        method: "PATCH",
        data: { kycStatus },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "DriverProfile", id: driverId },
        { type: "AdminDrivers", id: driverId },
        { type: "AdminDrivers", id: "LIST" },
        { type: "KYCRequests", id: "LIST" },
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
  useUpdateDriverKYCStatusMutation,
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
