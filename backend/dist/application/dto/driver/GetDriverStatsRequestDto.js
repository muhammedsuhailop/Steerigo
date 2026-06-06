"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverStatsRequestDto = exports.getDriverStatsSchema = void 0;
const ValidationErrors_1 = require("../../../domain/errors/ValidationErrors");
const zod_1 = require("zod");
exports.getDriverStatsSchema = zod_1.z
    .object({
    fromDate: zod_1.z.coerce.date().optional(),
    toDate: zod_1.z.coerce.date().optional(),
})
    .refine((data) => {
    if (data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate;
    }
    return true;
}, {
    message: "fromDate must be less than or equal to toDate",
    path: ["fromDate"],
});
class GetDriverStatsRequestDto {
    constructor(userId, fromDate, toDate) {
        this.userId = userId;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
    static fromRequest(userId, query) {
        const parsed = exports.getDriverStatsSchema.safeParse(query);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            const field = typeof firstError.path[0] === "string" ? firstError.path[0] : undefined;
            throw new ValidationErrors_1.ValidationError(firstError.message, field);
        }
        const { fromDate, toDate } = parsed.data;
        return new GetDriverStatsRequestDto(userId, fromDate, toDate);
    }
    getUserId() {
        return this.userId;
    }
    getFromDate() {
        return this.fromDate;
    }
    getToDate() {
        return this.toDate;
    }
}
exports.GetDriverStatsRequestDto = GetDriverStatsRequestDto;
//# sourceMappingURL=GetDriverStatsRequestDto.js.map