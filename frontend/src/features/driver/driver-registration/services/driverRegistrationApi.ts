import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  DriverRegistrationData,
  UploadResponse,
  FileUploadResponse,
  DriverRegistrationApiResponse,
} from "../types/driverRegistration.types";

export const driverRegistrationApi = createApi({
  reducerPath: "driverRegistrationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverRegistration", "FileUpload"],
  endpoints: (builder) => ({
    registerDriver: builder.mutation<
      DriverRegistrationApiResponse,
      DriverRegistrationData
    >({
      query: (driverData) => {
        const backendData = {
          // Personal Info - direct mapping
          name: driverData.name,
          mobile: driverData.mobile,
          dob: driverData.dob,
          gender: driverData.gender,
          state: driverData.state,
          pin: driverData.pin,
          address: driverData.address,

          // License Info
          licenseCategory: driverData.licenseCategory,
          licenseNumber: driverData.licenseNumber,
          licenseBodyTypes: Array.isArray(driverData.licenseBodyTypes)
            ? driverData.licenseBodyTypes
            : [],
          licenseGearTypes: Array.isArray(driverData.licenseGearTypes)
            ? driverData.licenseGearTypes
            : [],
          licenseIssueDate: driverData.licenseIssueDate,
          licenseExpiryDate: driverData.licenseExpiryDate,

          // ID Info
          idType: driverData.idType,
          idNumber: driverData.idNumber,
          idIssueDate: driverData.idIssueDate,
          idExpiryDate: driverData.idExpiryDate,

          // Documents - convert File objects to URLs
          licenseFrontImage:
            typeof driverData.licenseFrontImage === "string"
              ? driverData.licenseFrontImage
              : "",
          licenseBackImage:
            typeof driverData.licenseBackImage === "string"
              ? driverData.licenseBackImage
              : "",
          idFrontImage:
            typeof driverData.idFrontImage === "string"
              ? driverData.idFrontImage
              : "",
          idBackImage:
            typeof driverData.idBackImage === "string"
              ? driverData.idBackImage
              : "",
        };

        console.log("Frontend data:", driverData);
        console.log("Transformed backend data:", backendData);

        return {
          url: "/driver/register",
          method: "POST",
          data: backendData,
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
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["FileUpload"],
    }),
  }),
});

export const { useRegisterDriverMutation, useUploadFileMutation } =
  driverRegistrationApi;
