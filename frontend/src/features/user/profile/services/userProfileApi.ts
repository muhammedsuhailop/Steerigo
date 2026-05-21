import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";

import type {
  ProfilePictureData,
  UserProfile,
  UserProfileFormData,
} from "../types/userProfile.types";
import { updateUser } from "@/features/auth/store/authSlice";
import { UserStats } from "../types/userStats.types";

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
        url: `${API_ENDPOINTS.USER.PROFILE}`,
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
        url: `${API_ENDPOINTS.USER.PROFILE}`,
        method: "PUT",
        data,
      }),

      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;

          const updatedProfile = response.data;

          dispatch(
            userProfileApi.util.updateQueryData(
              "getUserProfile",
              userId,
              (draft) => {
                draft.data = updatedProfile;
              },
            ),
          );

          dispatch(
            updateUser({
              name: updatedProfile.name,
              email: updatedProfile.email,
            }),
          );
        } catch (err) {
          console.error("Profile update failed", err);
        }
      },

      invalidatesTags: (result, error, { userId }) => [
        { type: "UserProfile", id: userId },
        { type: "UserStats", id: userId },
      ],
    }),

    // Get user statistics
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => ({
        url: `${API_ENDPOINTS.USER.STATS}`,
        method: "GET",
      }),
      providesTags: ["UserStats"],
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
          url: `${API_ENDPOINTS.USER.PROFILE_PIC_UPLOAD}/${userId}`,
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
        url: `${API_ENDPOINTS.USER.PROFILE}/${userId}`,
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
        url: `/user/register-as-driver`,
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
