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
      FormData
    >({
      query: (formData) => ({
        url: "/register",
        method: "POST",
        body: formData,
        prepareHeaders: (headers: { delete: (arg0: string) => void }) => {
          headers.delete("content-type");
          return headers;
        },
      }),
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
          prepareHeaders: (headers: { delete: (arg0: string) => void }) => {
            headers.delete("content-type");
            return headers;
          },
        };
      },
    }),

    validateDriverData: builder.mutation<
      { isValid: boolean; errors?: Record<string, string> },
      Partial<DriverRegistrationData>
    >({
      query: (driverData) => ({
        url: "/validate",
        method: "POST",
        body: driverData,
      }),
    }),

    checkDriverExists: builder.mutation<
      { exists: boolean; message?: string },
      { mobile: string; licenseNumber?: string }
    >({
      query: (checkData) => ({
        url: "/check-exists",
        method: "POST",
        body: checkData,
      }),
    }),
  }),
});

export const {
  useRegisterDriverMutation,
  useUploadDocumentMutation,
  useValidateDriverDataMutation,
  useCheckDriverExistsMutation,
} = driverRegistrationApi;
