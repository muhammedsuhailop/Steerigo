import { Request, Response, NextFunction } from "express";
export declare function requireRoles(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleMiddleware.d.ts.map