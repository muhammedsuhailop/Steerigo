import { Server as HttpServer } from "http";
import { Server as SocketIOServer, DefaultEventsMap, RemoteSocket } from "socket.io";
import { ITokenService } from "../../application/services/ITokenService";
import { UserRole } from "../../shared/constants/AuthConstants";
export interface SocketData {
    userId: string;
    role: UserRole;
    accessToken: string;
}
export declare function initializeRideSocketServer(httpServer: HttpServer, corsOrigins: string[], tokenService: ITokenService): SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
export declare function getRideSocketServer(): SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
export declare function disconnectAllSockets(): Promise<void>;
export declare function getSocketByUserId(userId: string): Promise<RemoteSocket<DefaultEventsMap, SocketData> | null>;
//# sourceMappingURL=socket.d.ts.map