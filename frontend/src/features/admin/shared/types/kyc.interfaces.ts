export interface KYCDocument {
  id: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string | null;
  verificationStatus: "InReview" | "Approved" | "Rejected";
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface KYCDriver {
  driverId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  driverStatus: "Active" | "Inactive" | "Suspended";
}

export interface KYCRequest {
  kyc: KYCDocument;
  driver: KYCDriver;
}

export interface KYCPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface KYCListResponse {
  success: boolean;
  message: string;
  data: {
    kycDocuments: KYCRequest[];
    pagination: KYCPagination;
  };
}

export interface KYCDetailResponse {
  success: boolean;
  message: string;
  data: KYCRequest;
}

export interface KYCUpdateRequest {
  requestId: string;
  action: "approve" | "reject";
  reason?: string;
  status?: "approved" | "rejected";
}

export interface KYCUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    kyc: KYCDocument;
  };
}

export interface KYCFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type KYCAction = "Approved" | "Rejected";

export type KYCVerificationStatus = "InReview" | "Approved" | "Rejected";

export type KYCDocType =
  | "License"
  | "PAN"
  | "Aadhaar"
  | "Passport"
  | "Vehicle Registration"
  | "Insurance";

export type DriverStatus = "Active" | "Inactive" | "Suspended";

export interface KYCDocumentDetail {
  id: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string | null;
  verificationStatus: "InReview" | "Approved" | "Rejected";
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface KYCDriverDetail {
  driverId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  driverStatus: "Active" | "Inactive" | "Suspended";
}

export interface KYCDetailRequest {
  kyc: KYCDocumentDetail;
  driver: KYCDriverDetail;
}

export interface KYCDetailResponseData {
  success: boolean;
  message: string;
  data: KYCDetailRequest;
}

export interface KYCActionPayload {
  requestId: string;
  action: "Approved" | "Rejected";
  reason?: string;
  status?: "approved" | "rejected";
}

// Filter options for UI components
export const KYC_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "InReview", label: "In Review" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
] as const;

export const KYC_SORT_OPTIONS = [
  { value: "createdAt", label: "Submission Date" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "verificationStatus", label: "Status" },
  { value: "docType", label: "Document Type" },
] as const;

export const KYC_DOC_TYPES = [
  "License",
  "PAN",
  "Aadhaar",
  "Passport",
  "Vehicle Registration",
  "Insurance",
] as const;
