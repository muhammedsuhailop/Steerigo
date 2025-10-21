import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminDriver {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  kycStatus: string;
  rating: number;
  totalRides: number;
}

interface KYCRequest {
  id: string;
  driverId: string;
  driverName: string;
  status: "pending" | "approved" | "rejected";
  documents: {
    licenseFrontImage: string;
    licenseBackImage: string;
    idFrontImage: string;
    idBackImage: string;
  };
  submittedAt: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminUsers", "AdminDrivers", "KYCRequests"],
  endpoints: (builder) => ({
    // User Management
    getAllUsers: builder.query<
      { data: AdminUser[] },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "/admin/users",
        method: "GET",
        params: { page, limit, status },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "AdminUsers" as const,
                id,
              })),
              { type: "AdminUsers", id: "LIST" },
            ]
          : [{ type: "AdminUsers", id: "LIST" }],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; data: AdminUser },
      { userId: string; status: string }
    >({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "AdminUsers", id: userId },
        { type: "AdminUsers", id: "LIST" },
      ],
    }),

    // Driver Management
    getAllDrivers: builder.query<
      { data: AdminDriver[] },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "/admin/drivers",
        method: "GET",
        params: { page, limit, status },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "AdminDrivers" as const,
                id,
              })),
              { type: "AdminDrivers", id: "LIST" },
            ]
          : [{ type: "AdminDrivers", id: "LIST" }],
    }),

    getDriverById: builder.query<{ data: AdminDriver }, string>({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "AdminDrivers", id: driverId },
      ],
    }),

    updateDriverStatus: builder.mutation<
      { success: boolean; data: AdminDriver },
      { driverId: string; status: string }
    >({
      query: ({ driverId, status }) => ({
        url: `/admin/drivers/${driverId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { driverId }) => [
        { type: "AdminDrivers", id: driverId },
        { type: "AdminDrivers", id: "LIST" },
      ],
    }),

    // KYC Management
    getKYCRequests: builder.query<
      { data: KYCRequest[] },
      { status?: "pending" | "approved" | "rejected" }
    >({
      query: ({ status }) => ({
        url: "/admin/kyc/requests",
        method: "GET",
        params: status ? { status } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "KYCRequests" as const,
                id,
              })),
              { type: "KYCRequests", id: "LIST" },
            ]
          : [{ type: "KYCRequests", id: "LIST" }],
    }),

    updateKYCStatus: builder.mutation<
      { success: boolean; data: KYCRequest },
      { requestId: string; status: "approved" | "rejected"; reason?: string }
    >({
      query: ({ requestId, status, reason }) => ({
        url: `/admin/kyc/requests/${requestId}`,
        method: "PATCH",
        data: { status, reason },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "KYCRequests", id: requestId },
        { type: "KYCRequests", id: "LIST" },
        { type: "AdminDrivers", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetAllDriversQuery,
  useGetDriverByIdQuery,
  useUpdateDriverStatusMutation,
  useGetKYCRequestsQuery,
  useUpdateKYCStatusMutation,
} = adminApi;
