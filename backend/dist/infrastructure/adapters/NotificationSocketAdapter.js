"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSocketAdapter = void 0;
const Logger_1 = require("@shared/utils/Logger");
const socket_1 = require("@infrastructure/realtime/socket");
const SocketEvents_1 = require("@infrastructure/realtime/constants/SocketEvents");
class NotificationSocketAdapter {
    static tryGetSocketServer() {
        try {
            return (0, socket_1.getRideSocketServer)();
        }
        catch (error) {
            Logger_1.Logger.debug("Socket.IO unavailable in this process", {
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }
    static emitToUser(userId, payload) {
        try {
            const io = this.tryGetSocketServer();
            if (!io) {
                return;
            }
            const room = `user:${userId}`;
            io.to(room).emit(SocketEvents_1.SOCKET_EVENTS.NOTIFICATION_CREATED, payload);
            Logger_1.Logger.debug("Notification emitted to socket", {
                userId,
                room,
                notificationId: payload.notificationId,
                type: payload.type,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Notification socket emit failed", {
                userId,
                notificationId: payload.notificationId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
}
exports.NotificationSocketAdapter = NotificationSocketAdapter;
//# sourceMappingURL=NotificationSocketAdapter.js.map