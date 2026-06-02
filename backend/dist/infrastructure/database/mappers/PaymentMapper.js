"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMapper = void 0;
const Payment_1 = require("@domain/entities/Payment");
const Money_1 = require("@domain/value-objects/Money");
const mongoose_1 = require("mongoose");
class PaymentMapper {
    static toDomain(doc) {
        const amount = Money_1.Money.create(doc.amount, doc.currency);
        const refundedAmount = Money_1.Money.create(doc.refundedAmount ?? 0, doc.currency);
        return Payment_1.Payment.fromData({
            id: doc.paymentId,
            rideId: doc.rideId,
            riderId: doc.riderId.toString(),
            driverId: doc.driverId ? doc.driverId.toString() : "",
            amount,
            refundedAmount,
            method: doc.method,
            status: doc.status,
            paymentIntentId: doc.paymentIntentId,
            gateway: doc.gateway,
            gatewayOrderId: doc.gatewayOrderId,
            gatewayPaymentId: doc.gatewayPaymentId,
            gatewaySignature: doc.gatewaySignature,
            failureReason: doc.failureReason,
            metadata: doc.metadata ?? {},
            paidAt: doc.paidAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        const currency = entity.getAmount().getCurrency();
        return {
            paymentId: entity.getId(),
            rideId: entity.getRideId(),
            riderId: new mongoose_1.Types.ObjectId(entity.getRiderId()),
            driverId: entity.getDriverId()
                ? new mongoose_1.Types.ObjectId(entity.getDriverId())
                : undefined,
            amount: entity.getAmount().getAmount(),
            refundedAmount: entity.getRefundedAmount().getAmount(),
            currency,
            method: entity.getMethod(),
            status: entity.getStatus(),
            paymentIntentId: entity.getPaymentIntentId(),
            gateway: entity.getGateway(),
            gatewayOrderId: entity.getGatewayOrderId(),
            gatewayPaymentId: entity.getGatewayPaymentId(),
            gatewaySignature: entity.getGatewaySignature(),
            failureReason: entity.getFailureReason(),
            metadata: entity.getMetadata() ? { ...entity.getMetadata() } : {},
            paidAt: entity.getPaidAt(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.PaymentMapper = PaymentMapper;
//# sourceMappingURL=PaymentMapper.js.map