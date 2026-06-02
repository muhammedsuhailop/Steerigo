import { Request, Response, NextFunction } from "express";
declare module "express" {
    interface Request {
        user?: {
            userId: string;
            role: string;
        };
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=AuthMiddleware.d.ts.map