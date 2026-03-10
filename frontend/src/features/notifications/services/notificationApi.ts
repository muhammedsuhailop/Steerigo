import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { NotificationsResponse } from "../types/notifications.types";
import { API_ENDPOINTS } from "@/shared/constants";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.NOTIFICATION.GET_NOTIFICATIONS,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<
      { success: boolean },
      { notificationId?: string; markAll?: boolean }
    >({
      query: (args) => ({
        url: API_ENDPOINTS.NOTIFICATION.MARK_AS_READ,
        method: "PATCH",
        data: args,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } =
  notificationApi;
