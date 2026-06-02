"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminTransactionsSchema = void 0;
const zod_1 = require("zod");
exports.getAdminTransactionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        walletId: zod_1.z.string().optional(),
        ownerId: zod_1.z.string().optional(),
        ownerType: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        direction: zod_1.z.string().optional(),
        relatedEntityId: zod_1.z.string().optional(),
        relatedEntityType: zod_1.z.string().optional(),
        fromDate: zod_1.z.string().optional(),
        toDate: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(["createdAt", "amount"]).optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=transactionValidators.js.map