import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";

import type {
  DriverProfileResponse,
  DriverProfile,
  KYCDocument,
  LicenseInfo,
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
        url: "/driver/profile",
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
        url: "/driver/profile",
        method: "PUT",
        data,
      }),
      transformResponse: (response: ApiResponse<DriverProfile>) => {
        return response.data;
      },
      invalidatesTags: ["DriverProfile"],
    }),

    uploadDriverProfilePicture: builder.mutation<
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
        { type: "DriverProfile", id: userId },
      ],
    }),

    // Add KYC Document
    addKYCDocument: builder.mutation<KYCDocument, KYCPayload>({
      query: (payload) => ({
        url: "/driver/kyc",
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
