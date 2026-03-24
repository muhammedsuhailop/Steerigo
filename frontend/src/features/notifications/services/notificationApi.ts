import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import {
  NotificationsResponse,
  NotificationSocketPayload,
  Notification,
} from "../types/notifications.types";
import { API_ENDPOINTS } from "@/shared/constants";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";

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
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        let socket = getSocket();

        try {
          await cacheDataLoaded;

          if (socket?.connected) {
            const handleNewNotification = (
              payload: NotificationSocketPayload,
            ) => {
              updateCachedData((draft) => {
                if (!draft?.data) return;

                const exists = draft.data.notifications.some(
                  (n) => n.id === payload.notificationId,
                );

                if (!exists) {
                  draft.data.notifications.unshift({
                    id: payload.notificationId,
                    type: payload.type,
                    title: payload.title,
                    body: payload.body,
                    metadata: payload.metadata,
                    isRead: false,
                    createdAt: payload.createdAt,
                  });

                  draft.data.unreadCount += 1;
                }
              });
            };

            socket.on(
              SOCKET_EVENTS.NOTIFICATION.CREATED,
              handleNewNotification,
            );

            await cacheEntryRemoved;

            socket.off(
              SOCKET_EVENTS.NOTIFICATION.CREATED,
              handleNewNotification,
            );
          }
        } catch (error) {
          console.error("Notification socket setup failed", error);
        }
      },
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
