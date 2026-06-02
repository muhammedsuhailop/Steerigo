"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserCouponsDto = exports.getUserCouponsSchema = void 0;
const ValidationErrors_1 = require("../../../domain/errors/ValidationErrors");
const zod_1 = require("zod");
exports.getUserCouponsSchema = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .int()
        .min(1, { message: "Page must be greater than 0" })
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1, { message: "Limit must be at least 1" })
        .max(100, { message: "Limit must be at most 100" })
        .default(10),
});
class GetUserCouponsDto {
    constructor(userId, page, limit) {
        this.userId = userId;
        this.page = page;
        this.limit = limit;
    }
    static fromRequest(userId, query) {
        const parsed = exports.getUserCouponsSchema.safeParse(query);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            throw new ValidationErrors_1.ValidationError(firstError.message, firstError.path[0]);
        }
        const { page, limit } = parsed.data;
        return new GetUserCouponsDto(userId, page, limit);
    }
    getUserId() {
        return this.userId;
    }
    getPage() {
        return this.page;
    }
    getLimit() {
        return this.limit;
    }
}
exports.GetUserCouponsDto = GetUserCouponsDto;
//# sourceMappingURL=GetUserCouponsDto.js.map