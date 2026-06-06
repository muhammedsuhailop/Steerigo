"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUserStatusRequest = exports.validateGetUsersRequest = void 0;
const zod_1 = require("zod");
const AdminAction_1 = require("../../../domain/value-objects/AdminAction");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const getUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
        status: zod_1.z
            .enum(["Active", "Inactive", "Suspended", "Pending Verification"])
            .optional(),
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
            .enum(["name", "email", "createdAt", "totalBookings", "totalSpent"])
            .default("createdAt"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    }),
});
const updateUserStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
    body: zod_1.z.object({
        action: zod_1.z.enum([
            AdminAction_1.AdminUserAction.ACTIVATE,
            AdminAction_1.AdminUserAction.DEACTIVATE,
            AdminAction_1.AdminUserAction.SUSPEND,
            AdminAction_1.AdminUserAction.DELETE,
        ]),
        reason: zod_1.z
            .string()
            .min(3, "Reason must be at least 3 characters")
            .max(500, "Reason cannot exceed 500 characters")
            .optional(),
    }),
});
const validateGetUsersRequest = (req, res, next) => {
    try {
        const validatedData = getUsersSchema.parse({
            query: req.query,
        });
        req.query = validatedData.query;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get users validation failed", {
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
exports.validateGetUsersRequest = validateGetUsersRequest;
const validateUpdateUserStatusRequest = (req, res, next) => {
    try {
        const validatedData = updateUserStatusSchema.parse({
            params: req.params,
            body: req.body,
        });
        req.params = validatedData.params;
        req.body = validatedData.body;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Update user status validation failed", {
            userId: req.params?.userId,
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
exports.validateUpdateUserStatusRequest = validateUpdateUserStatusRequest;
//# sourceMappingURL=AdminUserValidator.js.map