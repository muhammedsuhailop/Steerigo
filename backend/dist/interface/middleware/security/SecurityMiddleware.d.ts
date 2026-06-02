import { Request, Response, NextFunction } from "express";
import cors from "cors";
export declare class SecurityMiddleware {
    static helmet(): (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    static cors(): (req: cors.CorsRequest, res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
    }, next: (err?: any) => any) => void;
    static requestLogger(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=SecurityMiddleware.d.ts.map