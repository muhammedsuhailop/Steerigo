"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRideRoomHandlers = registerRideRoomHandlers;
const Logger_1 = require("../../../shared/utils/Logger");
const SocketEvents_1 = require("../constants/SocketEvents");
function registerRideRoomHandlers(socket) {
    const { userId, role } = socket.data;
    socket.on(SocketEvents_1.SOCKET_EVENTS.RIDE_JOIN, (rideId) => {
        if (!rideId)
            return;
        socket.join(`ride:${rideId}`);
        Logger_1.Logger.info("Socket joined ride room", {
            socketId: socket.id,
            userId,
            role,
            rideId,
        });
    });
    socket.on(SocketEvents_1.SOCKET_EVENTS.RIDE_LEAVE, (rideId) => {
        if (!rideId)
            return;
        socket.leave(`ride:${rideId}`);
        Logger_1.Logger.info("Socket left ride room", {
            socketId: socket.id,
            userId,
            role,
            rideId,
        });
    });
}
//# sourceMappingURL=RideRoomHandler.js.map