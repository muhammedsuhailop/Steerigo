"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetUserProfileRequest = void 0;
const zod_1 = require("zod");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const Logger_1 = require("@shared/utils/Logger");
const getUserProfileSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid UserId format"),
    }),
});
const validateGetUserProfileRequest = (req, res, next) => {
    try {
        const validatedData = getUserProfileSchema.parse({
            params: req.params,
        });
        req.params = validatedData.params;
        next();
    }
    catch (error) {
        Logger_1.Logger.warn("Get user profile validation failed", {
            userId: req.params?.userId,
            error: error instanceof zod_1.z.ZodError ? error.issues : error,
        });
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.issues.map((err) => err.message).join(", ");
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
exports.validateGetUserProfileRequest = validateGetUserProfileRequest;
//# sourceMappingURL=adminUserProfileValidator.js.map