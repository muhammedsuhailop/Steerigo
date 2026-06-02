"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminWalletSchema = void 0;
const zod_1 = require("zod");
const TransactionType_1 = require("../../../domain/value-objects/TransactionType");
const TransactionDirection_1 = require("../../../domain/value-objects/TransactionDirection");
exports.getAdminWalletSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        type: zod_1.z.nativeEnum(TransactionType_1.TransactionType).optional(),
        direction: zod_1.z.nativeEnum(TransactionDirection_1.TransactionDirection).optional(),
        fromDate: zod_1.z.string().optional(),
        toDate: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=adminWalletValidators.js.map