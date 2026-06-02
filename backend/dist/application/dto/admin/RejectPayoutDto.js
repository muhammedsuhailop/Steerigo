"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectPayoutDto = void 0;
class RejectPayoutDto {
    constructor(adminId, payoutId, reason) {
        this.adminId = adminId;
        this.payoutId = payoutId;
        this.reason = reason;
    }
    static create(params) {
        return new RejectPayoutDto(params.adminId, params.payoutId, params.reason);
    }
    getAdminId() {
        return this.adminId;
    }
    getPayoutId() {
        return this.payoutId;
    }
    getReason() {
        return this.reason;
    }
}
exports.RejectPayoutDto = RejectPayoutDto;
//# sourceMappingURL=RejectPayoutDto.js.map