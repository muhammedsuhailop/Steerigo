import { Socket } from "socket.io";
import { ITokenService } from "../../../application/services/ITokenService";
export declare function createSocketAuthMiddleware(tokenService: ITokenService): (socket: Socket, next: (err?: Error) => void) => Promise<void>;
//# sourceMappingURL=SocketAuthMiddleware.d.ts.map