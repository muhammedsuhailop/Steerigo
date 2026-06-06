"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRideSocketServer = initializeRideSocketServer;
exports.getRideSocketServer = getRideSocketServer;
exports.disconnectAllSockets = disconnectAllSockets;
exports.getSocketByUserId = getSocketByUserId;
const socket_io_1 = require("socket.io");
const Logger_1 = require("../../shared/utils/Logger");
const AuthConstants_1 = require("../../shared/constants/AuthConstants");
const DIContainer_1 = require("../container/DIContainer");
const DITypes_1 = require("../../shared/constants/DITypes");
const SocketAuthMiddleware_1 = require("./middleware/SocketAuthMiddleware");
const RideRoomHandler_1 = require("./handlers/RideRoomHandler");
const DriverLocationHandler_1 = require("./handlers/DriverLocationHandler");
const SocketEvents_1 = require("./constants/SocketEvents");
const ChatRoomHandler_1 = require("./handlers/ChatRoomHandler");
let ioInstance = null;
function initializeRideSocketServer(httpServer, corsOrigins, tokenService) {
    if (ioInstance) {
        Logger_1.Logger.warn("Socket.IO already initialized. Returning existing instance.");
        return ioInstance;
    }
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        ...corsOrigins.filter(Boolean),
    ].filter(Boolean);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
        },
    });
    Logger_1.Logger.info("Socket.IO server initialized", {
        allowedOrigins,
    });
    const driverLocationRepository = DIContainer_1.container.get(DITypes_1.TYPES.DriverLocationRepository);
    io.use((0, SocketAuthMiddleware_1.createSocketAuthMiddleware)(tokenService));
    Logger_1.Logger.info("Socket authentication middleware registered");
    io.on("connection", (socket) => {
        const { userId, role } = socket.data;
        Logger_1.Logger.info("Socket connected", {
            socketId: socket.id,
            userId,
            role,
        });
        const userRoom = `user:${userId}`;
        socket.join(userRoom);
        Logger_1.Logger.info("User joined unified room", {
            socketId: socket.id,
            userId,
            room: userRoom,
        });
        if (role === AuthConstants_1.UserRole.DRIVER) {
            const room = `driver:${userId}`;
            socket.join(room);
            Logger_1.Logger.info("Driver joined socket room", {
                socketId: socket.id,
                userId,
                room,
            });
        }
        if (role === AuthConstants_1.UserRole.RIDER) {
            const room = `rider:${userId}`;
            socket.join(room);
            Logger_1.Logger.info("Rider joined socket room", {
                socketId: socket.id,
                userId,
                room,
            });
        }
        (0, RideRoomHandler_1.registerRideRoomHandlers)(socket);
        Logger_1.Logger.debug("Ride room handlers registered", {
            socketId: socket.id,
            userId,
        });
        (0, DriverLocationHandler_1.registerDriverLocationHandler)(io, socket, driverLocationRepository);
        Logger_1.Logger.debug("Driver location handler registered", {
            socketId: socket.id,
            userId,
        });
        (0, ChatRoomHandler_1.registerChatRoomHandlers)(socket);
        Logger_1.Logger.debug("Chat room handlers registered", {
            socketId: socket.id,
            userId,
        });
        socket.on("disconnect", (reason) => {
            Logger_1.Logger.info("Socket disconnected", {
                socketId: socket.id,
                userId,
                role,
                reason,
            });
        });
        socket.on(SocketEvents_1.SOCKET_EVENTS.AUTH_LOGOUT, () => {
            Logger_1.Logger.info("Client requested logout", {
                socketId: socket.id,
                userId,
            });
            socket.disconnect(true);
        });
    });
    ioInstance = io;
    Logger_1.Logger.info("Socket.IO connection listener registered");
    return io;
}
function getRideSocketServer() {
    if (!ioInstance) {
        throw new Error("Ride Socket.IO server not initialized");
    }
    return ioInstance;
}
async function disconnectAllSockets() {
    if (!ioInstance)
        return;
    Logger_1.Logger.info("Disconnecting all active sockets");
    const sockets = await ioInstance.fetchSockets();
    Logger_1.Logger.info("Total sockets to disconnect", {
        count: sockets.length,
    });
    sockets.forEach((socket) => socket.disconnect(true));
    ioInstance.close();
    ioInstance = null;
    Logger_1.Logger.info("All sockets disconnected and Socket.IO server closed");
}
async function getSocketByUserId(userId) {
    if (!ioInstance) {
        Logger_1.Logger.warn("Socket lookup attempted before initialization", { userId });
        return null;
    }
    Logger_1.Logger.debug("Searching socket for user", { userId });
    const sockets = await ioInstance.fetchSockets();
    const socket = sockets.find((s) => s.data.userId === userId) ?? null;
    if (!socket) {
        Logger_1.Logger.debug("No active socket found for user", { userId });
    }
    else {
        Logger_1.Logger.debug("Socket found for user", {
            userId,
            socketId: socket.id,
        });
    }
    return socket;
}
//# sourceMappingURL=socket.js.map