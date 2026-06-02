export declare const ADMIN_MESSAGES: {
    readonly DRIVER: {
        readonly DRIVERS_FETCHED: "Drivers fetched successfully";
        readonly DRIVER_PROFILE_FETCHED: "Driver profile fetched successfully";
        readonly KYC_REQUESTS_FETCHED: "KYC requests fetched successfully";
        readonly KYC_DOCUMENT_FETCHED: "KYC document fetched successfully";
    };
    readonly USER: {
        readonly USERS_FETCHED: "Users fetched successfully";
        readonly USER_STATUS_UPDATED: "User status updated successfully";
        readonly USER_PROFILE_FETCHED: "User profile fetched successfully";
    };
    readonly PAYOUT: {
        readonly RETRIVED: "Payouts retrieved successfully.";
        readonly APPROVED: "Payout approved and processed successfully.";
        readonly REJECTED: "Payout request rejected.";
    };
    readonly WALLET: {
        readonly FETCHED: "Admin wallet fetched successfully";
    };
    readonly STATS: {
        readonly USER_FETCHED: "User stats fetched successfully";
        readonly RIDE_FETCHED: "Ride stats fetched successfully";
        readonly DRIVER_FETCHED: "Drivers stats fetched successfully";
    };
};
export declare const ADMIN_ERROR_MESSAGES: {
    USER: {
        NOT_FOUND: string;
        INVALID_ACTION: string;
        UNAUTHORIZED_ACTION: string;
    };
    PAYOUT: {
        WALLET_DEBIT_FAILED_ON_APPROVAL: string;
    };
};
//# sourceMappingURL=AdminMessages.d.ts.map