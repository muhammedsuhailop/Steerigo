"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovePayoutDto = void 0;
class ApprovePayoutDto {
    constructor(adminId, payoutId) {
        this.adminId = adminId;
        this.payoutId = payoutId;
    }
    static create(params) {
        return new ApprovePayoutDto(params.adminId, params.payoutId);
    }
    getAdminId() {
        return this.adminId;
    }
    getPayoutId() {
        return this.payoutId;
    }
}
exports.ApprovePayoutDto = ApprovePayoutDto;
//# sourceMappingURL=ApprovePayoutDto.js.map