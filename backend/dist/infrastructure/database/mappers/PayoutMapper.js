"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutMapper = void 0;
const Payout_1 = require("@domain/entities/Payout");
const Money_1 = require("@domain/value-objects/Money");
class PayoutMapper {
    static toDomain(doc) {
        const amount = Money_1.Money.create(doc.amount, doc.currency);
        const fee = doc.fee && doc.feeCurrency
            ? Money_1.Money.create(doc.fee, doc.feeCurrency)
            : undefined;
        const destination = doc.destination;
        return Payout_1.Payout.fromData({
            id: doc.payoutId,
            driverId: doc.driverId,
            amount,
            currency: doc.currency,
            status: doc.status,
            method: doc.method,
            destination,
            externalPayoutId: doc.externalPayoutId,
            fee,
            failureReason: doc.failureReason,
            createdAt: doc.createdAt,
            processedAt: doc.processedAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        const amount = entity.getAmount();
        const fee = entity.getFee();
        return {
            payoutId: entity.getId(),
            driverId: entity.getDriverId(),
            amount: amount.getAmount(),
            currency: amount.getCurrency(),
            status: entity.getStatus(),
            method: entity.getMethod(),
            destination: entity.getDestination(),
            externalPayoutId: entity.getExternalPayoutId(),
            fee: fee?.getAmount(),
            feeCurrency: fee?.getCurrency(),
            failureReason: entity.getFailureReason(),
            processedAt: entity.getProcessedAt(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.PayoutMapper = PayoutMapper;
//# sourceMappingURL=PayoutMapper.js.map