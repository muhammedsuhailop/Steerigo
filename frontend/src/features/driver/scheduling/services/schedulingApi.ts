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
} from "../types/scheduling.types";

export const schedulingApi = createApi({
  reducerPath: "schedulingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Schedule", "Status", "Location", "Exceptions"],
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

    getExceptions: builder.query<Exception[], void>({
      query: () => ({
        url: `${API_ENDPOINTS.DRIVER.AVAILABILITY.EXCEPTION}`,
        method: "GET",
      }),
      providesTags: ["Exceptions"],
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
      invalidatesTags: ["Exceptions", "Schedule"],
    }),

    deleteException: builder.mutation<ExceptionDeleteResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVER.AVAILABILITY.EXCEPTION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exceptions"],
    }),
  }),
});

export const {
  useUpdateLocationMutation,
  useUpdateScheduleMutation,
  useUpdateStatusMutation,
  useGetExceptionsQuery,
  useCreateExceptionMutation,
  useDeleteExceptionMutation,
} = schedulingApi;
