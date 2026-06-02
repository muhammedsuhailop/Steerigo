"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentFailedSchema = exports.MarkPaymentFailedDto = void 0;
const PaymentFailureReason_1 = require("../../../domain/value-objects/PaymentFailureReason");
const zod_1 = require("zod");
const markPaymentFailedSchema = zod_1.z.object({
    paymentId: zod_1.z.string().min(1, "paymentId is required"),
    reason: zod_1.z
        .nativeEnum(PaymentFailureReason_1.PaymentFailureReason)
        .optional()
        .default(PaymentFailureReason_1.PaymentFailureReason.USER_CANCELLED),
});
exports.markPaymentFailedSchema = markPaymentFailedSchema;
class MarkPaymentFailedDto {
    constructor(userId, bodyData) {
        this.userId = userId;
        this.data = markPaymentFailedSchema.parse(bodyData);
    }
    static fromRequest(userId, body) {
        return new MarkPaymentFailedDto(userId, body);
    }
    getUserId() {
        return this.userId;
    }
    getPaymentId() {
        return this.data.paymentId;
    }
    getReason() {
        return this.data.reason;
    }
}
exports.MarkPaymentFailedDto = MarkPaymentFailedDto;
//# sourceMappingURL=MarkPaymentFailedDto.js.map