import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  DriverRegistrationData,
  UploadResponse,
  FileUploadResponse,
} from "../types/driverRegistration.types";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
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
  tagTypes: ["DriverRegistration", "FileUpload"],
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
          url: "/driver/register",
          method: "POST",
          body: formattedData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["DriverRegistration"],
    }),

    uploadFile: builder.mutation<
      FileUploadResponse,
      { file: File; purpose: string }
    >({
      query: ({ file, purpose }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", purpose);

        return {
          url: "/file/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["FileUpload"],
    }),

    //   // Legacy upload document endpoint (for backward compatibility)
    //   uploadDocument: builder.mutation<
    //     UploadResponse,
    //     { file: File; fieldName: string }
    //   >({
    //     query: ({ file, fieldName }) => {
    //       const formData = new FormData();
    //       formData.append("document", file);
    //       formData.append("fieldName", fieldName);

    //       return {
    //         url: "/driver/upload-document",
    //         method: "POST",
    //         body: formData,
    //       };
    //     },
    //   }),
  }),
});

export const {
  useRegisterDriverMutation,
  // useUploadDocumentMutation,
  useUploadFileMutation,
} = driverRegistrationApi;
