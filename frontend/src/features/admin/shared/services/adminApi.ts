import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import {
  KYCDetailResponseData,
  KYCListResponse,
  KYCVerificationStatus,
} from "../types/kyc.interfaces";
import {
  AdminDriver,
  AdminUser,
  KYCUpdateResponse,
  PaginationResponse,
} from "../types/admin.interfaces";
import {
  AdminDriverProfileResponse,
  DriverProfileAction,
} from "../types/adminDriverProfile.types";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { UserAction } from "../../user/user-management/components/UserManagement";
import {
  AdminUserProfileInfo,
  AdminUserProfileResponse,
} from "../types/admin.user.interfaces";

type BaseListQueryParams = {
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
};

const actionToStatusMap: Record<UserAction, AdminUser["status"]> = {
  block: "Blocked",
  activate: "Active",
  deactivate: "Inactive",
  suspend: "Suspended",
  verify: "Active",
};

type QueryParams = BaseListQueryParams | undefined;

const buildParams = (params?: BaseListQueryParams) => {
  if (!params) return undefined;

  const out: Partial<BaseListQueryParams & { pageSize: number }> = {};

  if (params.page) out.page = params.page;
  if (params.limit) out.pageSize = params.limit;
  if (params.pageSize && !params.limit) out.pageSize = params.pageSize;

  (
    [
      "status",
      "kycStatus",
      "search",
      "vehicleType",
      "sortBy",
      "sortOrder",
      "dateFrom",
      "dateTo",
    ] as const
  ).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "sortOrder") {
        if (value === "asc" || value === "desc") {
          out.sortOrder = value;
        }
      } else {
        out[key] = value;
      }
    }
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
    "UserProfile",
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

      async onQueryStarted(
        { userId, action },
        { dispatch, getState, queryFulfilled },
      ) {
        const state = getState();

        const queries = adminApi.util.selectInvalidatedBy(state, [
          { type: "AdminUsers", id: "LIST" },
        ]);

        const patches: any[] = [];

        for (const { originalArgs } of queries) {
          const patch = dispatch(
            adminApi.util.updateQueryData(
              "getAllUsers",
              originalArgs,
              (draft) => {
                const user = draft.data.users.find(
                  (u) => (u.userId ?? u.id) === userId,
                );

                if (user) {
                  user.status = actionToStatusMap[action];
                }
              },
            ),
          );

          patches.push(patch);
        }

        try {
          await queryFulfilled;
        } catch (error) {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    getUserProfileById: builder.query<AdminUserProfileResponse, string>({
      query: (userId) => ({
        url: `${API_ENDPOINTS.ADMIN.USERS}/${userId}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
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
      { success: boolean; message: string; data: DriverProfileAction },
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
        totalItems?: number;
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
      { success: boolean; message: string; data?: unknown },
      {
        driverId: string;
        kycStatus: KYCVerificationStatus;
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
  useGetUserProfileByIdQuery,
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
