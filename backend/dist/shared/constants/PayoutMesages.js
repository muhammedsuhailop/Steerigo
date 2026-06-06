"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYOUT_ERROR_MESSAGES = void 0;
exports.PAYOUT_ERROR_MESSAGES = {
    PAYOUT_NOT_FOUND: "Payout {{payoutId}} not found.",
    PAYOUT_NOT_REQUESTED: "Payout {{payoutId}} is not in REQUESTED state.",
    INSUFFICIENT_DRIVER_BALANCE: "Insufficient driver wallet balance. Available: {{available}}, Requested: {{requested}}.",
    DRIVER_WALLET_NOT_FOUND: "Wallet not found for driver {{driverId}}.",
    BELOW_MINIMUM_PAYOUT_AMOUNT: "Payout amount must be at least {{currency}} {{minimum}}.",
    PENDING_PAYOUT_EXISTS: "Driver {{driverId}} already has a pending payout request.",
    UNAUTHORIZED_PAYOUT_ACCESS: "Unauthorized access to payout {{payoutId}}.",
};
//# sourceMappingURL=PayoutMesages.js.map