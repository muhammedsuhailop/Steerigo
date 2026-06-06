import { Request, Response, NextFunction } from "express";
export declare const validateLoginRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRefreshTokenRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const createLoginValidationMiddleware: (options?: {
    enableRateLimit?: boolean;
    enableLogging?: boolean;
}) => ((req: Request, res: Response, next: NextFunction) => void)[];
//# sourceMappingURL=LoginValidator.d.ts.map