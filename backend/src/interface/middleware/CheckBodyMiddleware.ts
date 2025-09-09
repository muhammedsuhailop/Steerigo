import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@shared/types/Common";

//Middleware to check if request body exists and optionally validate required fields.
export const checkBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("req headers", req.headers);
  console.log(`[${req.method}] ${req.originalUrl} body:`, req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    const response: ApiResponse = {
      success: false,
      message: "Request body is missing",
    };
    res.status(400).json(response);
    return;
  }

  next();
};
