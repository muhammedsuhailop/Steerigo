"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketAuthMiddleware = createSocketAuthMiddleware;
const Logger_1 = require("../../../shared/utils/Logger");
function createSocketAuthMiddleware(tokenService) {
    return async (socket, next) => {
        try {
            const { accessToken } = socket.handshake.auth;
            if (!accessToken) {
                Logger_1.Logger.warn("Socket connection attempt without access token", {
                    socketId: socket.id,
                });
                return next(new Error("Unauthorized"));
            }
            const payload = await tokenService.verifyAccessToken(accessToken);
            if (!payload) {
                Logger_1.Logger.warn("Socket connection with invalid access token", {
                    socketId: socket.id,
                });
                return next(new Error("Unauthorized"));
            }
            const { userId, role } = payload;
            if (!userId || !role) {
                return next(new Error("Unauthorized"));
            }
            socket.data.userId = userId;
            socket.data.role = role;
            socket.data.accessToken = accessToken;
            Logger_1.Logger.info("Socket authenticated", {
                socketId: socket.id,
                userId,
                role,
            });
            next();
        }
        catch (error) {
            Logger_1.Logger.error("Socket authentication error", { error });
            next(new Error("Unauthorized"));
        }
    };
}
//# sourceMappingURL=SocketAuthMiddleware.js.map