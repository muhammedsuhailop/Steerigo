"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYC_STATUS_TRANSITIONS = exports.VALID_KYC_STATUSES = exports.KYCStatus = void 0;
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["IN_REVIEW"] = "InReview";
    KYCStatus["REJECTED"] = "Rejected";
    KYCStatus["APPROVED"] = "Approved";
    KYCStatus["EXPIRED"] = "Expired";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
exports.VALID_KYC_STATUSES = Object.values(KYCStatus);
exports.KYC_STATUS_TRANSITIONS = {
    [KYCStatus.IN_REVIEW]: [KYCStatus.APPROVED, KYCStatus.REJECTED],
    [KYCStatus.APPROVED]: [KYCStatus.EXPIRED],
    [KYCStatus.REJECTED]: [KYCStatus.IN_REVIEW],
    [KYCStatus.EXPIRED]: [KYCStatus.IN_REVIEW],
};
//# sourceMappingURL=KYCStatus.js.map