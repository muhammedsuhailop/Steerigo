"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverWalletSchema = exports.GetDriverWalletDto = void 0;
const zod_1 = require("zod");
const TransactionType_1 = require("../../../domain/value-objects/TransactionType");
const TransactionDirection_1 = require("../../../domain/value-objects/TransactionDirection");
const getDriverWalletSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
    type: zod_1.z.nativeEnum(TransactionType_1.TransactionType).optional(),
    direction: zod_1.z.nativeEnum(TransactionDirection_1.TransactionDirection).optional(),
    fromDate: zod_1.z.string().datetime().optional(),
    toDate: zod_1.z.string().datetime().optional(),
});
exports.getDriverWalletSchema = getDriverWalletSchema;
class GetDriverWalletDto {
    constructor(userId, queryData) {
        this.userId = userId;
        this.data = getDriverWalletSchema.parse(queryData);
    }
    static fromRequest(userId, query) {
        return new GetDriverWalletDto(userId, query);
    }
    getUserId() {
        return this.userId;
    }
    getPage() {
        return this.data.page;
    }
    getLimit() {
        return this.data.limit;
    }
    getSortOrder() {
        return this.data.sortOrder;
    }
    getType() {
        return this.data.type;
    }
    getDirection() {
        return this.data.direction;
    }
    getFromDate() {
        return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
    }
    getToDate() {
        return this.data.toDate ? new Date(this.data.toDate) : undefined;
    }
}
exports.GetDriverWalletDto = GetDriverWalletDto;
//# sourceMappingURL=GetDriverWalletDto.js.map