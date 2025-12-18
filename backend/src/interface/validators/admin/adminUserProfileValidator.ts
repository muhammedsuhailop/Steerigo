import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

const getUserProfileSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid UserId format"),
  }),
});

export const validateGetUserProfileRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getUserProfileSchema.parse({
      params: req.params,
    });

    req.params = validatedData.params;

    next();
  } catch (error) {
    Logger.warn("Get user profile validation failed", {
      userId: req.params?.userId,
      error: error instanceof z.ZodError ? error.issues : error,
    });

    if (error instanceof z.ZodError) {
      const messages = error.issues.map((err) => err.message).join(", ");

      const response: ApiResponse<null> = {
        success: false,
        message: `Validation failed: ${messages}`,
      };

      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }

    next(error);
  }
};
