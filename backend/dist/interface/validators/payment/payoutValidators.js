"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminPayoutsSchema = exports.rejectPayoutSchema = exports.approvePayoutSchema = exports.requestPayoutSchema = void 0;
const zod_1 = require("zod");
const PayoutMethod_1 = require("../../../domain/value-objects/PayoutMethod");
const PayoutStatus_1 = require("../../../domain/value-objects/PayoutStatus");
const bankDestinationSchema = zod_1.z.object({
    type: zod_1.z.literal("BANK"),
    accountNumber: zod_1.z.string().min(8).max(20),
    ifsc: zod_1.z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    beneficiaryName: zod_1.z.string().min(2),
    bankName: zod_1.z.string().optional(),
});
const upiDestinationSchema = zod_1.z.object({
    type: zod_1.z.literal("UPI"),
    upiId: zod_1.z.string().regex(/^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID"),
    beneficiaryName: zod_1.z.string().optional(),
});
exports.requestPayoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z
            .number({ error: "amount is required" })
            .min(100, "Minimum payout amount is ₹100"),
        method: zod_1.z.nativeEnum(PayoutMethod_1.PayoutMethod, { message: "Invalid payout method" }),
        destination: zod_1.z.discriminatedUnion("type", [
            bankDestinationSchema,
            upiDestinationSchema,
        ]),
    }),
});
exports.approvePayoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        payoutId: zod_1.z.string().min(1, "payoutId is required"),
    }),
});
exports.rejectPayoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        payoutId: zod_1.z.string().min(1, "payoutId is required"),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(5, "Rejection reason must be at least 5 characters"),
    }),
});
exports.getAdminPayoutsSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(PayoutStatus_1.PayoutStatus).optional(),
        driverId: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().min(1).optional().default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(50).optional().default(10),
        sortBy: zod_1.z.enum(["createdAt", "amount"]).optional().default("createdAt"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
    }),
});
//# sourceMappingURL=payoutValidators.js.map