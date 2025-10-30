import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  ScheduleData,
  UpdateLocationPayload,
  UpdateStatusPayload,
} from "../types/scheduling.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const schedulingApi = createApi({
  reducerPath: "schedulingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Schedule", "Status", "Location"],
  endpoints: (builder) => ({
    updateLocation: builder.mutation<void, UpdateLocationPayload>({
      query: (data) => ({
        url: `/driver/availability/update-location`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Location"],
    }),
    updateSchedule: builder.mutation<void, ScheduleData>({
      query: (data) => ({
        url: `/driver/availability/schedule`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    updateStatus: builder.mutation<void, UpdateStatusPayload>({
      query: (data) => ({
        url: `/driver/availability/status`,
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
