import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  ProfilePictureData,
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
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserProfile", "UserStats"],
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query<ApiResponse<UserProfile>, string>({
      query: (userId) => ({
        url: `/user/profile/${userId}`,
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
        url: `/user/profile/${userId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "UserProfile", id: userId },
        { type: "UserStats", id: userId },
      ],
    }),

    // Get user statistics
    getUserStats: builder.query<ApiResponse<UserStats>, string>({
      query: (userId) => ({
        url: `/user/profile/${userId}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserStats", id: userId },
      ],
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<
      ApiResponse<ProfilePictureData>,
      { userId: string; file: File }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/file/profile-picture/${userId}`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        url: `/user/profile/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
        { type: "UserStats", id: userId },
      ],
    }),

    // Register as driver
    registerAsDriver: builder.mutation<
      { success: boolean; message: string; data: UserProfile },
      string
    >({
      query: (userId) => ({
        url: `/user/${userId}/register-as-driver`,
        method: "POST",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "UserProfile", id: userId },
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
  useRegisterAsDriverMutation,
} = userProfileApi;
