import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import type {
  UserProfile,
  UserProfileFormData,
  UserStats,
} from "../types/userProfile.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user/profile",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["UserProfile", "UserStats"],
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query<ApiResponse<UserProfile>, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
      ],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<
      ApiResponse<UserProfile>,
      { userId: string; data: Partial<UserProfileFormData> }
    >({
      query: ({ userId, data }) => ({
        url: `/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "UserProfile", id: userId },
        { type: "UserStats", id: userId },
      ],
    }),

    // Get user statistics
    getUserStats: builder.query<ApiResponse<UserStats>, string>({
      query: (userId) => ({
        url: `/${userId}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserStats", id: userId },
      ],
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<
      ApiResponse<{ profilePictureUrl: string }>,
      { userId: string; file: File }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("profilePicture", file);

        return {
          url: `/${userId}/upload-picture`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "UserProfile", id: userId },
      ],
    }),

    // Delete user account
    deleteUserAccount: builder.mutation<
      ApiResponse<{ message: string }>,
      string
    >({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
        { type: "UserStats", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserStatsQuery,
  useUploadProfilePictureMutation,
  useDeleteUserAccountMutation,
} = userProfileApi;
