"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payout = void 0;
const PayoutStatus_1 = require("../value-objects/PayoutStatus");
class Payout {
    constructor(id, driverId, amount, currency, status, method, destination, externalPayoutId, fee, failureReason, createdAt = new Date(), processedAt, updatedAt = new Date()) {
        this.id = id;
        this.driverId = driverId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.method = method;
        this.destination = destination;
        this.externalPayoutId = externalPayoutId;
        this.fee = fee;
        this.failureReason = failureReason;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
        this.updatedAt = updatedAt;
    }
    static request(params) {
        if (params.amount.getAmount() <= 0) {
            throw new Error("Payout amount must be positive");
        }
        return new Payout(params.id, params.driverId, params.amount, params.amount.getCurrency(), PayoutStatus_1.PayoutStatus.REQUESTED, params.method, params.destination, undefined, params.fee, undefined, new Date(), undefined, new Date());
    }
    static fromData(data) {
        const p = new Payout(data.id, data.driverId, data.amount, data.currency, data.status, data.method, data.destination, data.externalPayoutId, data.fee, data.failureReason, data.createdAt, data.processedAt, data.updatedAt);
        return p;
    }
    markProcessing(externalPayoutId) {
        if (this.status !== PayoutStatus_1.PayoutStatus.REQUESTED) {
            throw new Error("Only requested payouts can be moved to processing");
        }
        this.status = PayoutStatus_1.PayoutStatus.PROCESSING;
        if (externalPayoutId) {
            this.externalPayoutId = externalPayoutId;
        }
        this.updatedAt = new Date();
    }
    markCompleted(processedAt) {
        if (this.status !== PayoutStatus_1.PayoutStatus.PROCESSING) {
            throw new Error("Only processing payouts can be marked completed");
        }
        this.status = PayoutStatus_1.PayoutStatus.COMPLETED;
        this.processedAt = processedAt ?? new Date();
        this.updatedAt = new Date();
    }
    markFailed(reason) {
        if (this.status !== PayoutStatus_1.PayoutStatus.PROCESSING &&
            this.status !== PayoutStatus_1.PayoutStatus.REQUESTED) {
            throw new Error("Only requested or processing payouts can be failed");
        }
        this.status = PayoutStatus_1.PayoutStatus.FAILED;
        if (reason)
            this.failureReason = reason;
        this.updatedAt = new Date();
    }
    cancel() {
        if (this.status !== PayoutStatus_1.PayoutStatus.REQUESTED) {
            throw new Error("Only requested payouts can be cancelled");
        }
        this.status = PayoutStatus_1.PayoutStatus.CANCELLED;
        this.updatedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getDriverId() {
        return this.driverId;
    }
    getAmount() {
        return this.amount;
    }
    getCurrency() {
        return this.currency;
    }
    getStatus() {
        return this.status;
    }
    getMethod() {
        return this.method;
    }
    getDestination() {
        return this.destination;
    }
    getExternalPayoutId() {
        return this.externalPayoutId;
    }
    getFee() {
        return this.fee;
    }
    getFailureReason() {
        return this.failureReason;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getProcessedAt() {
        return this.processedAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Payout = Payout;
//# sourceMappingURL=Payout.js.map