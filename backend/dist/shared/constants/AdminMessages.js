"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ERROR_MESSAGES = exports.ADMIN_MESSAGES = void 0;
exports.ADMIN_MESSAGES = {
    DRIVER: {
        DRIVERS_FETCHED: "Drivers fetched successfully",
        DRIVER_PROFILE_FETCHED: "Driver profile fetched successfully",
        KYC_REQUESTS_FETCHED: "KYC requests fetched successfully",
        KYC_DOCUMENT_FETCHED: "KYC document fetched successfully",
    },
    USER: {
        USERS_FETCHED: "Users fetched successfully",
        USER_STATUS_UPDATED: "User status updated successfully",
        USER_PROFILE_FETCHED: "User profile fetched successfully",
    },
    PAYOUT: {
        RETRIVED: "Payouts retrieved successfully.",
        APPROVED: "Payout approved and processed successfully.",
        REJECTED: "Payout request rejected.",
    },
    WALLET: {
        FETCHED: "Admin wallet fetched successfully",
    },
    STATS: {
        USER_FETCHED: "User stats fetched successfully",
        RIDE_FETCHED: "Ride stats fetched successfully",
        DRIVER_FETCHED: "Drivers stats fetched successfully",
    },
};
exports.ADMIN_ERROR_MESSAGES = {
    USER: {
        NOT_FOUND: "Admin user not found",
        INVALID_ACTION: "Invalid admin action",
        UNAUTHORIZED_ACTION: "You are not authorized to perform this action",
    },
    PAYOUT: {
        WALLET_DEBIT_FAILED_ON_APPROVAL: "Wallet debit failed during approval",
    },
};
//# sourceMappingURL=AdminMessages.js.map