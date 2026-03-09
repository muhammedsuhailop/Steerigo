import { Socket } from "socket.io";
import { ITokenService } from "../../../application/services/ITokenService";
import { Logger } from "../../../shared/utils/Logger";
import { UserRole } from "../../../shared/constants/AuthConstants";

interface SocketAuthPayload {
  accessToken: string;
}

export function createSocketAuthMiddleware(tokenService: ITokenService) {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const { accessToken } = socket.handshake.auth as SocketAuthPayload;

      if (!accessToken) {
        Logger.warn("Socket connection attempt without access token", {
          socketId: socket.id,
        });
        return next(new Error("Unauthorized"));
      }

      const payload = await tokenService.verifyAccessToken(accessToken);

      if (!payload) {
        Logger.warn("Socket connection with invalid access token", {
          socketId: socket.id,
        });
        return next(new Error("Unauthorized"));
      }

      const { userId, role } = payload;

      if (!userId || !role) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = userId;
      socket.data.role = role as UserRole;
      socket.data.accessToken = accessToken;

      Logger.info("Socket authenticated", {
        socketId: socket.id,
        userId,
        role,
      });

      next();
    } catch (error) {
      Logger.error("Socket authentication error", { error });
      next(new Error("Unauthorized"));
    }
  };
}
