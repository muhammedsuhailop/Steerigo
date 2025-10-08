import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AdminUserAction } from "@domain/value-objects/AdminAction";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: z
      .enum(["Active", "Inactive", "Suspended", "Pending Verification"])
      .optional(),
    search: z.string().min(1).max(255).optional(),
    dateFrom: z
      .union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        z.string().datetime(),
      ])
      .optional(),
    dateTo: z
      .union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        z.string().datetime(),
      ])
      .optional(),
    sortBy: z
      .enum(["name", "email", "createdAt", "totalBookings", "totalSpent"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const updateUserStatusSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
  body: z.object({
    action: z.enum([
      AdminUserAction.ACTIVATE,
      AdminUserAction.DEACTIVATE,
      AdminUserAction.SUSPEND,
      AdminUserAction.DELETE,
    ]),
    reason: z
      .string()
      .min(3, "Reason must be at least 3 characters")
      .max(500, "Reason cannot exceed 500 characters")
      .optional(),
  }),
});

export const validateGetUsersRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getUsersSchema.parse({
      query: req.query,
    });

    req.query = validatedData.query as any;
    next();
  } catch (error) {
    Logger.warn("Get users validation failed", {
      query: req.query,
      error: error instanceof z.ZodError ? error.issues : error,
    });

    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((err: z.ZodIssue) => err.message)
        .join(", ");

      const response: ApiResponse = {
        success: false,
        message: `Validation failed: ${messages}`,
      };

      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }

    next(error);
  }
};

export const validateUpdateUserStatusRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = updateUserStatusSchema.parse({
      params: req.params,
      body: req.body,
    });

    req.params = validatedData.params;
    req.body = validatedData.body;
    next();
  } catch (error) {
    Logger.warn("Update user status validation failed", {
      userId: req.params?.userId,
      body: req.body,
      error: error instanceof z.ZodError ? error.issues : error,
    });

    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((err: z.ZodIssue) => err.message)
        .join(", ");

      const response: ApiResponse = {
        success: false,
        message: `Validation failed: ${messages}`,
      };

      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }

    next(error);
  }
};
