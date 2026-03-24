import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import {
  NotificationsResponse,
  NotificationQueryParams,
} from "../types/notifications.types";
import { API_ENDPOINTS } from "@/shared/constants";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationsResponse,
      NotificationQueryParams | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.NOTIFICATION.GET_NOTIFICATIONS,
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 12,
          isRead: params?.isRead,
        },
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
