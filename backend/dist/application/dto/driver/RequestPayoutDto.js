"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPayoutDto = void 0;
class RequestPayoutDto {
    constructor(userId, amount, method, destination) {
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.destination = destination;
    }
    static create(params) {
        return new RequestPayoutDto(params.userId, params.amount, params.method, params.destination);
    }
    getUserId() {
        return this.userId;
    }
    getAmount() {
        return this.amount;
    }
    getMethod() {
        return this.method;
    }
    getDestination() {
        return this.destination;
    }
}
exports.RequestPayoutDto = RequestPayoutDto;
//# sourceMappingURL=RequestPayoutDto.js.map