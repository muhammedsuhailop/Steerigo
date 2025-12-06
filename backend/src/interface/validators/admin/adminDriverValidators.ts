import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

// Driver validation schemas
const getDriversSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["Active", "Blocked", "Suspended"]).optional(),
    kycStatus: z
      .enum(["InReview", "Rejected", "Approved", "Expired"])
      .optional(),
    licenceCategory: z.enum(["LMV", "HMV", "MCWG", "MCWOG"]).optional(),
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
      .enum([
        "createdAt",
        "status",
        "kycStatus",
        "licenceCategory",
        "totalRides",
        "totalEarnings",
        "rating",
      ])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const driverActionSchema = z.object({
  params: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
  body: z.object({
    action: z.enum(["block", "suspend", "activate"], {
      message: "Action must be one of: block, suspend, activate",
    }),
    reason: z
      .string()
      .min(3, "Reason must be at least 3 characters")
      .max(500, "Reason cannot exceed 500 characters")
      .optional(),
  }),
});

// KYC validation schemas
const getKycRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    verificationStatus: z
      .enum(["InReview", "Approved", "Rejected", "Expired"])
      .optional(),
    docType: z.enum(["Aadhaar", "PAN", "License", "Passport"]).optional(),
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
      .optional(),
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
      .enum(["createdAt", "updatedAt", "verificationStatus", "docType"])
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const updateKycStatusSchema = z.object({
  params: z.object({
    kycId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
  body: z.object({
    verificationStatus: z.enum(["Approved", "Rejected", "Expired"], {
      message:
        "Verification status must be one of: Approved, Rejected, Expired",
    }),
    comments: z
      .string()
      .min(1, "Comments must be at least 1 character")
      .max(1000, "Comments cannot exceed 1000 characters")
      .optional(),
  }),
});

const updateDriverKycStatusSchema = z.object({
  params: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
  body: z.object({
    kycStatus: z.enum(["InReview", "Rejected", "Approved", "Expired"], {
      message:
        "KYC status must be one of: InReview, Rejected, Approved, Expired",
    }),
    comments: z
      .string()
      .min(1, "Comments must be at least 1 character")
      .max(1000, "Comments cannot exceed 1000 characters")
      .optional(),
  }),
});

const getDriverProfileSchema = z.object({
  params: z.object({
    driverId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
});

const getKycRequestByIdSchema = z.object({
  params: z.object({
    kycId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  }),
});

// Validation middleware functions
export const validateGetDriversRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getDriversSchema.parse({
      query: req.query,
    });
    req.query = validatedData.query as unknown as Request["query"];
    next();
  } catch (error) {
    Logger.warn("Get drivers validation failed", {
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

export const validateDriverActionRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = driverActionSchema.parse({
      params: req.params,
      body: req.body,
    });
    req.params = validatedData.params;
    req.body = validatedData.body;

    next();
  } catch (error) {
    Logger.warn("Driver action validation failed", {
      driverId: req.params?.driverId,
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

export const validateGetDriverProfileRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getDriverProfileSchema.parse({
      params: req.params,
    });
    req.params = validatedData.params;
    next();
  } catch (error) {
    Logger.warn("Get driver profile validation failed", {
      driverId: req.params?.driverId,
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

export const validateGetKycRequestsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getKycRequestsSchema.parse({
      query: req.query,
    });
    req.query = validatedData.query as unknown as Request["query"];
    next();
  } catch (error) {
    Logger.warn("Get KYC requests validation failed", {
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

export const validateUpdateKycStatusRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = updateKycStatusSchema.parse({
      params: req.params,
      body: req.body,
    });
    req.params = validatedData.params;
    req.body = validatedData.body;

    // Additional business validation
    if (req.body.verificationStatus === "Rejected" && !req.body.comments) {
      const response: ApiResponse = {
        success: false,
        message: "Comments are required when rejecting KYC documents",
      };
      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }

    next();
  } catch (error) {
    Logger.warn("Update KYC status validation failed", {
      kycId: req.params?.kycId,
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

export const validateGetKycRequestByIdRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = getKycRequestByIdSchema.parse({
      params: req.params,
    });
    req.params = validatedData.params;
    next();
  } catch (error) {
    Logger.warn("Get KYC request by ID validation failed", {
      kycId: req.params?.kycId,
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

export const validateUpdateDriverKycStatusRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const validatedData = updateDriverKycStatusSchema.parse({
      params: req.params,
      body: req.body,
    });
    req.params = validatedData.params;
    req.body = validatedData.body;

    if (req.body.kycStatus === "Rejected" && !req.body.comments) {
      const response: ApiResponse = {
        success: false,
        message: "Comments are required when rejecting driver KYC status",
      };
      res.status(HttpStatusCodes.BAD_REQUEST).json(response);
      return;
    }

    next();
  } catch (error) {
    Logger.warn("Update driver KYC status validation failed", {
      driverId: req.params?.driverId,
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
