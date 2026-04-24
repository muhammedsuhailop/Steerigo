import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../constants/SocketEvents";
import { Logger } from "@shared/utils/Logger";

export function registerChatRoomHandlers(socket: Socket): void {
  const { userId, role } = socket.data;

  socket.on(SOCKET_EVENTS.CHAT_JOIN, (chatRoomId: string) => {
    if (!chatRoomId) {
      return;
    }

    socket.join(`chat:${chatRoomId}`);

    Logger.info("Socket joined chat room", {
      socketId: socket.id,
      userId,
      role,
      chatRoomId,
    });
  });

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, (chatRoomId: string) => {
    if (!chatRoomId) {
      return;
    }

    socket.leave(`chat:${chatRoomId}`);

    Logger.info("Socket left chat room", {
      socketId: socket.id,
      userId,
      role,
      chatRoomId,
    });
  });
}
