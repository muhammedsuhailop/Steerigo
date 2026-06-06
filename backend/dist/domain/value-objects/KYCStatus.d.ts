export declare enum KYCStatus {
    IN_REVIEW = "InReview",
    REJECTED = "Rejected",
    APPROVED = "Approved",
    EXPIRED = "Expired"
}
export declare const VALID_KYC_STATUSES: KYCStatus[];
export declare const KYC_STATUS_TRANSITIONS: Record<KYCStatus, KYCStatus[]>;
//# sourceMappingURL=KYCStatus.d.ts.map