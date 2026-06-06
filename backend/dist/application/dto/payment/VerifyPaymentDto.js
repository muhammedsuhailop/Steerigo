"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPaymentDto = void 0;
class VerifyPaymentDto {
    constructor(userId, paymentId, gatewayOrderId, gatewayPaymentId, gatewaySignature) {
        this.userId = userId;
        this.paymentId = paymentId;
        this.gatewayOrderId = gatewayOrderId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.gatewaySignature = gatewaySignature;
    }
    static create(params) {
        return new VerifyPaymentDto(params.userId, params.paymentId, params.gatewayOrderId, params.gatewayPaymentId, params.gatewaySignature);
    }
    getUserId() {
        return this.userId;
    }
    getPaymentId() {
        return this.paymentId;
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
}
exports.VerifyPaymentDto = VerifyPaymentDto;
//# sourceMappingURL=VerifyPaymentDto.js.map