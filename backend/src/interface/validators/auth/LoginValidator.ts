import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AuthValidationMessages } from "@shared/constants/AuthConstants";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

// Login validation schema
const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .nonempty(AuthValidationMessages.EMAIL_REQUIRED)
      .email(AuthValidationMessages.EMAIL_INVALID)
      .max(255, AuthValidationMessages.EMAIL_TOO_LONG)
      .transform((email) => email.toLowerCase().trim()),

    password: z
      .string()
      .nonempty(AuthValidationMessages.PASSWORD_REQUIRED)
      .max(128, AuthValidationMessages.PASSWORD_TOO_LONG),
  }),
});

// Refresh token validation schema
const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .nonempty(AuthValidationMessages.REFRESH_TOKEN_REQUIRED)
      .min(64, AuthValidationMessages.REFRESH_TOKEN_INVALID)
      .max(256, AuthValidationMessages.REFRESH_TOKEN_INVALID),
  }),
});

export const validateLoginRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = loginSchema.parse({
      body: req.body,
    });

    // Replace request body with validated and transformed data
    req.body = validatedData.body;
    next();
  } catch (error) {
    Logger.warn("Login validation failed", {
      email: req.body?.email,
      error: error instanceof z.ZodError ? error.issues : error,
    });

    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      const response: ApiResponse = {
        success: false,
        message: messages,
      };
      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }
    next(error);
  }
};

export const validateRefreshTokenRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = refreshTokenSchema.parse({
      body: req.body,
    });

    req.body = validatedData.body;
    next();
  } catch (error) {
    Logger.warn("Refresh token validation failed", { error });

    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      const response: ApiResponse = {
        success: false,
        message: messages,
      };
      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }
    next(error);
  }
};

// Enhanced middleware with rate limiting integration
export const createLoginValidationMiddleware = (options?: {
  enableRateLimit?: boolean;
  enableLogging?: boolean;
}) => {
  return [
    ...(options?.enableRateLimit
      ? [
          /* add rate limiter here */
        ]
      : []),
    validateLoginRequest,
  ];
};
