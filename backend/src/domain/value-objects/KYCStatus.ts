export enum KYCStatus {
  IN_REVIEW = "InReview",
  REJECTED = "Rejected",
  APPROVED = "Approved",
  EXPIRED = "Expired",
}

export const VALID_KYC_STATUSES = Object.values(KYCStatus);

export const KYC_STATUS_TRANSITIONS: Record<KYCStatus, KYCStatus[]> = {
  [KYCStatus.IN_REVIEW]: [KYCStatus.APPROVED, KYCStatus.REJECTED],
  [KYCStatus.APPROVED]: [KYCStatus.EXPIRED],
  [KYCStatus.REJECTED]: [KYCStatus.IN_REVIEW],
  [KYCStatus.EXPIRED]: [KYCStatus.IN_REVIEW],
};
