"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmCashPaymentDto = void 0;
class ConfirmCashPaymentDto {
    constructor(userId, rideId, method, amount) {
        this.userId = userId;
        this.rideId = rideId;
        this.method = method;
        this.amount = amount;
    }
    static create(params) {
        return new ConfirmCashPaymentDto(params.userId, params.rideId, params.method, params.amount);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.rideId;
    }
    getMethod() {
        return this.method;
    }
    getAmount() {
        return this.amount;
    }
}
exports.ConfirmCashPaymentDto = ConfirmCashPaymentDto;
//# sourceMappingURL=ConfirmCashPaymentDto.js.map