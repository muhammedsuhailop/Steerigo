"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateDriverKycStatusRequest = exports.validateGetKycRequestByIdRequest = exports.validateUpdateKycStatusRequest = exports.validateGetKycRequestsRequest = exports.validateGetDriverProfileRequest = exports.validateDriverActionRequest = exports.validateGetDriversRequest = void 0;
const zod_1 = require("zod");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const Logger_1 = require("@shared/utils/Logger");
// Driver validation schemas
const getDriversSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
        status: zod_1.z.enum(["Active", "Blocked", "Suspended"]).optional(),
        kycStatus: zod_1.z
            .enum(["InReview", "Rejected", "Approved", "Expired"])
            .optional(),
        licenceCategory: zod_1.z.enum(["LMV", "HMV", "MCWG", "MCWOG"]).optional(),
        search: zod_1.z.string().min(1).max(255).optional(),
        dateFrom: zod_1.z
            .union([
            zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
            zod_1.z.string().datetime(),
        ])
            .optional(),
        dateTo: zod_1.z
            .union([
            zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
            zod_1.z.string().datetime(),
        ])
            .optional(),
        sortBy: zod_1.z
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
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    }),
});
const driverActionSchema = zod_1.z.object({
    params: zod_1.z.object({
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
    body: zod_1.z.object({
        action: zod_1.z.enum(["block", "suspend", "activate"], {
            message: "Action must be one of: block, suspend, activate",
        }),
        reason: zod_1.z
            .string()
            .min(3, "Reason must be at least 3 characters")
            .max(500, "Reason cannot exceed 500 characters")
            .optional(),
    }),
});
// KYC validation schemas
const getKycRequestsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
        verificationStatus: zod_1.z
            .enum(["InReview", "Approved", "Rejected", "Expired"])
            .optional(),
        docType: zod_1.z.enum(["Aadhaar", "PAN", "License", "Passport"]).optional(),
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
            .optional(),
        dateFrom: zod_1.z
            .union([
            zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
            zod_1.z.string().datetime(),
        ])
            .optional(),
        dateTo: zod_1.z
            .union([
            zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
            zod_1.z.string().datetime(),
        ])
            .optional(),
        sortBy: zod_1.z
            .enum(["createdAt", "updatedAt", "verificationStatus", "docType"])
            .default("createdAt"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    }),
});
const updateKycStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        kycId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
    body: zod_1.z.object({
        verificationStatus: zod_1.z.enum(["Approved", "Rejected", "Expired"], {
            message: "Verification status must be one of: Approved, Rejected, Expired",
        }),
        comments: zod_1.z
            .string()
            .min(1, "Comments must be at least 1 character")
            .max(1000, "Comments cannot exceed 1000 characters")
            .optional(),
    }),
});
const updateDriverKycStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
    body: zod_1.z.object({
        kycStatus: zod_1.z.enum(["InReview", "Rejected", "Approved", "Expired"], {
            message: "KYC status must be one of: InReview, Rejected, Approved, Expired",
        }),
        comments: zod_1.z
            .string()
            .min(1, "Comments must be at least 1 character")
            .max(1000, "Comments cannot exceed 1000 characters")
            .optional(),
    }),
});
const getDriverProfileSchema = zod_1.z.object({
    params: zod_1.z.object({
        driverId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
});
const getKycRequestByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        kycId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
});
// Validation middleware functions
const validateGetDriversRequest = (req, res, next) => {
    try {
        const validatedData = getDriversSchema.parse({
            query: req.query,
        });
        req.query = validatedData.query;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get drivers validation failed", {
            query: req.query,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateGetDriversRequest = validateGetDriversRequest;
const validateDriverActionRequest = (req, res, next) => {
    try {
        const validatedData = driverActionSchema.parse({
            params: req.params,
            body: req.body,
        });
        req.params = validatedData.params;
        req.body = validatedData.body;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Driver action validation failed", {
            driverId: req.params?.driverId,
            body: req.body,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateDriverActionRequest = validateDriverActionRequest;
const validateGetDriverProfileRequest = (req, res, next) => {
    try {
        const validatedData = getDriverProfileSchema.parse({
            params: req.params,
        });
        req.params = validatedData.params;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get driver profile validation failed", {
            driverId: req.params?.driverId,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateGetDriverProfileRequest = validateGetDriverProfileRequest;
const validateGetKycRequestsRequest = (req, res, next) => {
    try {
        const validatedData = getKycRequestsSchema.parse({
            query: req.query,
        });
        req.query = validatedData.query;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get KYC requests validation failed", {
            query: req.query,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateGetKycRequestsRequest = validateGetKycRequestsRequest;
const validateUpdateKycStatusRequest = (req, res, next) => {
    try {
        const validatedData = updateKycStatusSchema.parse({
            params: req.params,
            body: req.body,
        });
        req.params = validatedData.params;
        req.body = validatedData.body;
        // Additional business validation
        if (req.body.verificationStatus === "Rejected" && !req.body.comments) {
            const response = {
                success: false,
                message: "Comments are required when rejecting KYC documents",
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Update KYC status validation failed", {
            kycId: req.params?.kycId,
            body: req.body,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateUpdateKycStatusRequest = validateUpdateKycStatusRequest;
const validateGetKycRequestByIdRequest = (req, res, next) => {
    try {
        const validatedData = getKycRequestByIdSchema.parse({
            params: req.params,
        });
        req.params = validatedData.params;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get KYC request by ID validation failed", {
            kycId: req.params?.kycId,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateGetKycRequestByIdRequest = validateGetKycRequestByIdRequest;
const validateUpdateDriverKycStatusRequest = (req, res, next) => {
    try {
        const validatedData = updateDriverKycStatusSchema.parse({
            params: req.params,
            body: req.body,
        });
        req.params = validatedData.params;
        req.body = validatedData.body;
        if (req.body.kycStatus === "Rejected" && !req.body.comments) {
            const response = {
                success: false,
                message: "Comments are required when rejecting driver KYC status",
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Update driver KYC status validation failed", {
            driverId: req.params?.driverId,
            body: req.body,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues
                .map((err) => err.message)
                .join(", ");
            const response = {
                success: false,
                message: `Validation failed: ${messages}`,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json(response);
            return;
        }
        next(error);
    }
};
exports.validateUpdateDriverKycStatusRequest = validateUpdateDriverKycStatusRequest;
//# sourceMappingURL=adminDriverValidators.js.map