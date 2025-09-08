import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@shared/types/Common";

export function requireRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "Not authenticated",
      };
      res.status(401).json(response);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const response: ApiResponse = {
        success: false,
        message: "Access Restricted",
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
}
