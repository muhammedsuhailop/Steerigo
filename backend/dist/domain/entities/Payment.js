"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const PaymentMethod_1 = require("../value-objects/PaymentMethod");
const PaymentStatus_1 = require("../value-objects/PaymentStatus");
const Money_1 = require("../value-objects/Money");
class Payment {
    constructor(id, rideId, riderId, driverId, amount, refundedAmount, method, status, paymentIntentId, gateway, gatewayOrderId, gatewayPaymentId, gatewaySignature, failureReason, metadata = {}, paidAt, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.rideId = rideId;
        this.riderId = riderId;
        this.driverId = driverId;
        this.amount = amount;
        this.refundedAmount = refundedAmount;
        this.method = method;
        this.status = status;
        this.paymentIntentId = paymentIntentId;
        this.gateway = gateway;
        this.gatewayOrderId = gatewayOrderId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.gatewaySignature = gatewaySignature;
        this.failureReason = failureReason;
        this.metadata = metadata;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, rideId, riderId, driverId, amount, method, metadata = {}) {
        return new Payment(id, rideId, riderId, driverId, amount, Money_1.Money.zero(amount.getCurrency()), method, PaymentStatus_1.PaymentStatus.PENDING, undefined, undefined, undefined, undefined, undefined, undefined, metadata, undefined);
    }
    static fromData(data) {
        return new Payment(data.id, data.rideId, data.riderId, data.driverId, data.amount, data.refundedAmount, data.method, data.status, data.paymentIntentId, data.gateway, data.gatewayOrderId, data.gatewayPaymentId, data.gatewaySignature, data.failureReason ?? undefined, data.metadata ?? {}, data.paidAt, data.createdAt, data.updatedAt);
    }
    markSuccess(gatewayPaymentId, paidAt) {
        if (this.status !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error("Payment cannot be marked successful from current state");
        }
        this.status = PaymentStatus_1.PaymentStatus.SUCCESS;
        this.gatewayPaymentId = gatewayPaymentId;
        this.paidAt = paidAt ?? new Date();
        this.updatedAt = new Date();
    }
    markFailed(reason) {
        if (this.status !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error("Payment cannot be marked failed from current state");
        }
        this.status = PaymentStatus_1.PaymentStatus.FAILED;
        if (reason)
            this.failureReason = reason;
        this.updatedAt = new Date();
    }
    confirmCashCollected(timestamp) {
        if (this.method !== PaymentMethod_1.PaymentMethod.CASH) {
            throw new Error("confirmCashCollected only valid for cash payments");
        }
        if (this.status !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error("Payment cannot be confirmed from current state");
        }
        this.status = PaymentStatus_1.PaymentStatus.SUCCESS;
        this.paidAt = timestamp ?? new Date();
        this.updatedAt = new Date();
    }
    applyRefund(amount) {
        if (this.status !== PaymentStatus_1.PaymentStatus.SUCCESS &&
            this.status !== PaymentStatus_1.PaymentStatus.PARTIALLY_REFUNDED) {
            throw new Error("Refund allowed only for successful payments");
        }
        if (this.amount.getCurrency() !== amount.getCurrency()) {
            throw new Error("Refund currency must match payment currency");
        }
        const newRefundTotal = this.refundedAmount.add(amount);
        if (newRefundTotal.getAmount() > this.amount.getAmount()) {
            throw new Error("Refund amount exceeds payment amount");
        }
        this.refundedAmount = newRefundTotal;
        if (this.refundedAmount.getAmount() === this.amount.getAmount()) {
            this.status = PaymentStatus_1.PaymentStatus.REFUNDED;
        }
        else {
            this.status = PaymentStatus_1.PaymentStatus.PARTIALLY_REFUNDED;
        }
        this.updatedAt = new Date();
    }
    attachGatewayIds(params) {
        if (params.paymentIntentId)
            this.paymentIntentId = params.paymentIntentId;
        if (params.gateway)
            this.gateway = params.gateway;
        if (params.gatewayOrderId)
            this.gatewayOrderId = params.gatewayOrderId;
        if (params.gatewayPaymentId)
            this.gatewayPaymentId = params.gatewayPaymentId;
        if (params.gatewaySignature)
            this.gatewaySignature = params.gatewaySignature;
        this.updatedAt = new Date();
    }
    setFailureReason(reason) {
        this.failureReason = reason;
        this.updatedAt = new Date();
    }
    isCash() {
        return this.method === PaymentMethod_1.PaymentMethod.CASH;
    }
    isOnline() {
        return this.method === PaymentMethod_1.PaymentMethod.ONLINE;
    }
    getRemainingRefundableAmount() {
        return this.amount.subtract(this.refundedAmount);
    }
    getId() {
        return this.id;
    }
    getRideId() {
        return this.rideId;
    }
    getRiderId() {
        return this.riderId;
    }
    getDriverId() {
        return this.driverId;
    }
    getAmount() {
        return this.amount;
    }
    getRefundedAmount() {
        return this.refundedAmount;
    }
    getStatus() {
        return this.status;
    }
    getMethod() {
        return this.method;
    }
    getPaymentIntentId() {
        return this.paymentIntentId;
    }
    getGateway() {
        return this.gateway;
    }
    getGatewayOrderId() {
        return this.gatewayOrderId;
    }
    getGatewayPaymentId() {
        return this.gatewayPaymentId;
    }
    getGatewaySignature() {
        return this.gatewaySignature;
    }
    getFailureReason() {
        return this.failureReason;
    }
    getMetadata() {
        return { ...this.metadata };
    }
    getPaidAt() {
        return this.paidAt;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Payment = Payment;
//# sourceMappingURL=Payment.js.map