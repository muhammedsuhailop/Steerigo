import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";

import type {
  DriverProfileResponse,
  DriverProfile,
  KYCDocument,
  LicenseInfo,
  KYCPayload,
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
  useAddKYCDocumentMutation,
} = driverProfileApi;
