import { Request, Response, NextFunction, RequestHandler } from "express";
export declare class SecurityMiddleware {
    static helmet(): (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    static cors(): RequestHandler;
    static requestLogger(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=SecurityMiddleware.d.ts.map