import { getRideSocketServer } from "../realtime/socket";
import { SOCKET_EVENTS } from "../realtime/constants/SocketEvents";
import { NotificationSocketPayload } from "../../application/dto/notification/NotificationSocketPayload";
import { Logger } from "@shared/utils/Logger";

export class NotificationSocketAdapter {
  static emitToUser(userId: string, payload: NotificationSocketPayload) {
    try {
      const io = getRideSocketServer();

      const room = `user:${userId}`;

      Logger.debug("Emitting notification to socket", {
        userId,
        room,
        notificationId: payload.notificationId,
        type: payload.type,
      });

      io.to(room).emit(SOCKET_EVENTS.NOTIFICATION_CREATED, payload);

      Logger.debug("Notification emitted successfully", {
        userId,
        room,
        notificationId: payload.notificationId,
      });
    } catch (error) {
      Logger.error("Notification socket emit failed", {
        userId,
        payload,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
