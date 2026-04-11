import { Logger } from "@shared/utils/Logger";
import { getRideSocketServer } from "@infrastructure/realtime/socket";
import { NotificationSocketPayload } from "@application/dto/notification/NotificationSocketPayload";
import { SOCKET_EVENTS } from "@infrastructure/realtime/constants/SocketEvents";

export class NotificationSocketAdapter {
  private static tryGetSocketServer() {
    try {
      return getRideSocketServer();
    } catch (error) {
      Logger.debug("Socket.IO unavailable in this process", {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  static emitToUser(userId: string, payload: NotificationSocketPayload): void {
    try {
      const io = this.tryGetSocketServer();
      if (!io) {
        return;
      }

      const room = `user:${userId}`;

      io.to(room).emit(SOCKET_EVENTS.NOTIFICATION_CREATED, payload);

      Logger.debug("Notification emitted to socket", {
        userId,
        room,
        notificationId: payload.notificationId,
        type: payload.type,
      });
    } catch (error) {
      Logger.error("Notification socket emit failed", {
        userId,
        notificationId: payload.notificationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
