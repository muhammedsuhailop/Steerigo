import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "@/shared/socket/socket";
import { SOCKET_EVENTS } from "@/shared/socket/socketEvents";
import { notificationApi } from "../services/notificationApi";
import type { RootState } from "@/app/store/store";
import type {
  NotificationSocketPayload,
  Notification,
} from "../types/notifications.types";
import { useAppDispatch } from "@/app/store/hooks";

export const useNotificationSocket = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const socket = getSocket();
    if (!isAuthenticated || !socket) return;

    const handleNewNotification = (payload: NotificationSocketPayload) => {
      const newNotif: Notification = {
        id: payload.notificationId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        isRead: false,
        createdAt: payload.createdAt,
        metadata: payload.metadata,
      };

      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          { page: 1, limit: 12 },
          (draft) => {
            if (draft?.data) {
              draft.data.unreadCount += 1;

              const exists = draft.data.notifications.some(
                (n) => n.id === newNotif.id,
              );
              if (!exists) {
                draft.data.notifications.unshift(newNotif);
                if (draft.data.notifications.length > 12)
                  draft.data.notifications.pop();
              }
            }
          },
        ),
      );

      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          { page: 1, limit: 12, isRead: false },
          (draft) => {
            if (draft?.data) {
              draft.data.unreadCount += 1;
              const exists = draft.data.notifications.some(
                (n) => n.id === newNotif.id,
              );
              if (!exists) {
                draft.data.notifications.unshift(newNotif);
                if (draft.data.notifications.length > 12)
                  draft.data.notifications.pop();
              }
            }
          },
        ),
      );
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION.CREATED, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION.CREATED, handleNewNotification);
    };
  }, [isAuthenticated, dispatch]);
};
