import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  DriverRegistrationData,
  UploadResponse,
} from "../types/driverRegistration.types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/driver",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as any).auth.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const driverRegistrationApi = createApi({
  reducerPath: "driverRegistrationApi",
  baseQuery,
  tagTypes: ["DriverRegistration"],
  endpoints: (builder) => ({
    registerDriver: builder.mutation<
      { success: boolean; data: any; message: string },
      DriverRegistrationData
    >({
      query: (driverData) => {
        // Format data for backend
        const formattedData = {
          ...driverData,
          vehicleTypes: Array.isArray(driverData.bodyTypes)
            ? driverData.bodyTypes
            : [],
          gearTypes: Array.isArray(driverData.gearTypes)
            ? driverData.gearTypes
            : [],
          licenseCategory: Array.isArray(driverData.licenseCategory)
            ? driverData.licenseCategory
            : [],
          licenseBodyTypes: Array.isArray(driverData.licenseBodyTypes)
            ? driverData.licenseBodyTypes
            : [],
          licenseGearTypes: Array.isArray(driverData.licenseGearTypes)
            ? driverData.licenseGearTypes
            : [],
        };

        console.log("Sending driver registration data:", formattedData);

        return {
          url: "/register",
          method: "POST",
          body: formattedData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["DriverRegistration"],
    }),

    uploadDocument: builder.mutation<
      UploadResponse,
      { file: File; fieldName: string }
    >({
      query: ({ file, fieldName }) => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("fieldName", fieldName);

        return {
          url: "/upload-document",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useRegisterDriverMutation, useUploadDocumentMutation } =
  driverRegistrationApi;
