import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

export class ErrorHandlerMiddleware {
  // Global error handler - catches all unhandled errors

  static handle(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    // Use the centralized error handler service
    const { response, statusCode } = ErrorHandlerService.handleError(
      err,
      `${req.method} ${req.path}`
    );

    // Enhanced logging with request context
    Logger.error("Unhandled error occurred", {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      userId: req.user?.userId,
      ...(process.env.NODE_ENV !== "production" && {
        body: req.body,
        query: req.query,
        params: req.params,
      }),
    });

    res.status(statusCode).json(response);
  }

  //404 handler for API routes
  static notFound(req: Request, res: Response): void {
    const response: ApiResponse = {
      success: false,
      message: `API endpoint ${req.originalUrl} not found`,
    };

    Logger.warn("API endpoint not found", {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });

    res.status(404).json(response);
  }

  // Validation error handler - for express-validator
  static handleValidationErrors(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const { response, statusCode } =
        ErrorHandlerService.handleValidationErrors(errors.array());

      Logger.warn("Validation error", {
        errors: errors.array(),
        url: req.url,
        method: req.method,
        body: req.body,
      });

      res.status(statusCode).json(response);
      return;
    }

    next();
  }

  // Async error handler wrapper for controllers

  static asyncHandler<T extends Request, U extends Response>(
    fn: (req: T, res: U, next: NextFunction) => Promise<void>
  ) {
    return (req: T, res: U, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Standard controller error handler

  static handleControllerError(
    error: unknown,
    context: string
  ): { response: ApiResponse; statusCode: number } {
    return ErrorHandlerService.handleError(error, context);
  }
}

export const {
  handle,
  notFound,
  handleValidationErrors,
  asyncHandler,
  handleControllerError,
} = ErrorHandlerMiddleware;
