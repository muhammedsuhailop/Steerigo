import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";

import type {
  ScheduleData,
  UpdateLocationPayload,
  UpdateStatusPayload,
} from "../types/scheduling.types";

export const schedulingApi = createApi({
  reducerPath: "schedulingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Schedule", "Status", "Location"],
  endpoints: (builder) => ({
    updateLocation: builder.mutation<void, UpdateLocationPayload>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.UPDATE_LOCATION,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Location"],
    }),
    updateSchedule: builder.mutation<void, ScheduleData>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.SCHEDULE,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    updateStatus: builder.mutation<void, UpdateStatusPayload>({
      query: (data) => ({
        url: API_ENDPOINTS.DRIVER.AVAILABILITY.STATUS,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Status"],
    }),
  }),
});

export const {
  useUpdateLocationMutation,
  useUpdateScheduleMutation,
  useUpdateStatusMutation,
} = schedulingApi;
