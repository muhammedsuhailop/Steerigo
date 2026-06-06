"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentFailedValidatorSchema = exports.confirmCashPaymentSchema = exports.verifyPaymentSchema = exports.initiatePaymentSchema = void 0;
const zod_1 = require("zod");
const PaymentMethod_1 = require("../../../domain/value-objects/PaymentMethod");
const MarkPaymentFailedDto_1 = require("../../../application/dto/payment/MarkPaymentFailedDto");
exports.initiatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "rideId is required"),
        method: zod_1.z.nativeEnum(PaymentMethod_1.PaymentMethod, { message: "Invalid payment method" }),
    }),
});
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string().min(1, "paymentId is required"),
        gatewayOrderId: zod_1.z.string().min(1, "gatewayOrderId is required"),
        gatewayPaymentId: zod_1.z.string().min(1, "gatewayPaymentId is required"),
        gatewaySignature: zod_1.z.string().min(1, "gatewaySignature is required"),
    }),
});
exports.confirmCashPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.string().min(1, "rideId is required"),
        method: zod_1.z.literal(PaymentMethod_1.PaymentMethod.CASH, {
            message: "Payment method must be CASH",
        }),
        amount: zod_1.z
            .number({
            error: "amount is required",
        })
    }),
});
exports.markPaymentFailedValidatorSchema = zod_1.z.object({
    body: MarkPaymentFailedDto_1.markPaymentFailedSchema,
});
//# sourceMappingURL=paymentValidators.js.map