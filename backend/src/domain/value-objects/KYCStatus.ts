export enum KYCStatus {
  PENDING = "Pending",
  UNDER_REVIEW = "InReview",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export const VALID_KYC_STATUSES = Object.values(KYCStatus);

export const KYC_STATUS_TRANSITIONS: Record<KYCStatus, KYCStatus[]> = {
  [KYCStatus.PENDING]: [
    KYCStatus.UNDER_REVIEW,
    KYCStatus.APPROVED,
    KYCStatus.REJECTED,
  ],
  [KYCStatus.UNDER_REVIEW]: [KYCStatus.APPROVED, KYCStatus.REJECTED],
  [KYCStatus.APPROVED]: [],
  [KYCStatus.REJECTED]: [KYCStatus.PENDING],
};
