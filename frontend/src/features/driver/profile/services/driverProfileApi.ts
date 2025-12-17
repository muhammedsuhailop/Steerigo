import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";

import type {
  DriverProfileResponse,
  DriverProfile,
  KYCDocument,
  KYCPayload,
  ProfilePictureData,
} from "../types/driverProfile.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const driverProfileApi = createApi({
  reducerPath: "driverProfileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverProfile", "DriverKYC"],
  endpoints: (builder) => ({
    // Get driver profile
    getDriverProfile: builder.query<DriverProfileResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.DRIVER.PROFILE,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DriverProfile>) => {
        return response.data;
      },
      providesTags: ["DriverProfile", "DriverKYC"],
    }),

    // Update driver profile
    updateDriverProfile: builder.mutation<
      DriverProfileResponse,
      Partial<DriverProfile>
    >({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.PROFILE,
        method: "PUT",
        data,
      }),
      transformResponse: (response: ApiResponse<DriverProfile>) => {
        return response.data;
      },
      invalidatesTags: ["DriverProfile"],
    }),

    // Upload profile picture
    uploadDriverProfilePicture: builder.mutation<
      ApiResponse<ProfilePictureData>,
      { userId: string; file: File }
    >({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `${API_ENDPOINTS.DRIVER.PROFILE_PIC_UPLOAD}/${userId}`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "DriverProfile", id: userId },
      ],
    }),

    // Add KYC Document
    addKYCDocument: builder.mutation<KYCDocument, KYCPayload>({
      query: (payload) => ({
        url: API_ENDPOINTS.DRIVER.KYC,
        method: "PUT",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useUploadDriverProfilePictureMutation,
  useAddKYCDocumentMutation,
} = driverProfileApi;
