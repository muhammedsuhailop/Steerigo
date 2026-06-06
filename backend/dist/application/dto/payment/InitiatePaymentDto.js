"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiatePaymentDto = void 0;
class InitiatePaymentDto {
    constructor(userId, rideId, method) {
        this.userId = userId;
        this.rideId = rideId;
        this.method = method;
    }
    static create(params) {
        return new InitiatePaymentDto(params.userId, params.rideId, params.method);
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
}
exports.InitiatePaymentDto = InitiatePaymentDto;
//# sourceMappingURL=InitiatePaymentDto.js.map