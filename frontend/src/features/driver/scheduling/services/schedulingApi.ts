import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import type {
  ScheduleFormData,
  UpdateLocationPayload,
  UpdateStatusPayload,
  ExceptionFormData,
  ExceptionCreateResponse,
  ExceptionDeleteResponse,
  Exception,
  ExceptionUpdateFormData,
  ExceptionUpdateResponse,
  UpdateDriverBaseLocationResponse,
  UpdateBaseLocationRequest,
} from "../types/scheduling.types";

export const schedulingApi = createApi({
  reducerPath: "schedulingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Schedule", "Status", "Location", "Exceptions", "DriverStatus"],
  endpoints: (builder) => ({
    // Existing endpoints
    updateLocation: builder.mutation<any, UpdateLocationPayload>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.UPDATE_LOCATION,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Location"],
    }),

    updateBaseLocation: builder.mutation<
      UpdateDriverBaseLocationResponse,
      UpdateBaseLocationRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.UPDATE_BASE_LOCATION,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Location", "DriverStatus"],
    }),

    updateSchedule: builder.mutation<any, ScheduleFormData>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.SCHEDULE,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),

    updateStatus: builder.mutation<any, UpdateStatusPayload>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.STATUS,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Status"],
    }),

    createException: builder.mutation<
      ExceptionCreateResponse,
      ExceptionFormData
    >({
      query: (data) => ({
        url: `${API_ENDPOINTS.DRIVER.AVAILABILITY.EXCEPTION}`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Exceptions", "Schedule", "DriverStatus"],
    }),

    updateException: builder.mutation<
      ExceptionUpdateResponse,
      { id: string; data: ExceptionUpdateFormData }
    >({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.DRIVER.AVAILABILITY.EXCEPTION}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Exceptions", "Schedule", "DriverStatus"],
    }),

    deleteException: builder.mutation<ExceptionDeleteResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVER.AVAILABILITY.EXCEPTION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exceptions", "DriverStatus"],
    }),
  }),
});

export const {
  useUpdateLocationMutation,
  useUpdateBaseLocationMutation,
  useUpdateScheduleMutation,
  useUpdateStatusMutation,
  useCreateExceptionMutation,
  useUpdateExceptionMutation,
  useDeleteExceptionMutation,
} = schedulingApi;
