import { Socket } from "socket.io";
import { Logger } from "../../../shared/utils/Logger";
import { SOCKET_EVENTS } from "../constants/SocketEvents";

export function registerRideRoomHandlers(socket: Socket) {
  const { userId, role } = socket.data;

  socket.on(SOCKET_EVENTS.RIDE_JOIN, (rideId: string) => {
    if (!rideId) return;

    socket.join(`ride:${rideId}`);

    Logger.info("Socket joined ride room", {
      socketId: socket.id,
      userId,
      role,
      rideId,
    });
  });

  socket.on(SOCKET_EVENTS.RIDE_LEAVE, (rideId: string) => {
    if (!rideId) return;

    socket.leave(`ride:${rideId}`);

    Logger.info("Socket left ride room", {
      socketId: socket.id,
      userId,
      role,
      rideId,
    });
  });
}
