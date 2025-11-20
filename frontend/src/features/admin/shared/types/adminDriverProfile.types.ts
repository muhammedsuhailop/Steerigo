export interface AdminDriverProfileResponse {
  success: boolean;
  message: string;
  data: AdminDriverProfileData;
}

export interface AdminDriverProfileData {
  driver: DriverInfo;
  user: UserInfo;
  stats: DriverStats;
  kycDocuments: KYCDocument[];
}

export interface DriverInfo {
  id: string;
  userId: string;
  status: DriverStatus;
  kycStatus: KYCStatus;
  licenceCategory: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture?: string;
}

export interface DriverStats {
  totalRides: number;
  totalEarnings: number;
  rating: number;
  lastRideDate: string | null;
}

export interface KYCDocument {
  id: string;
  docType: KYCDocType;
  docNumber: string;
  issueDate: string | null;
  expiryDate: string | null;
  verificationStatus: KYCVerificationStatus;
  comments: string | null;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export type DriverStatus =
  | "Pending Verification"
  | "Active"
  | "Suspended"
  | "Inactive";
export type KYCStatus = "Approved" | "Pending" | "Rejected" | "InReview";

export type KYCVerificationStatus =
  | "Approved"
  | "InReview"
  | "Rejected"
  | "Expired";
export type KYCDocType = "License" | "Aadhaar" | "PAN" | "Passport";

export type DriverProfileAction = "activate" | "suspend" | "block";

// Props for components
export interface DriverDetailsProps {
  driver: DriverInfo;
  user: UserInfo;
  stats: DriverStats;
}

export interface VehicleDetailsProps {
  driver: DriverInfo;
}

export interface DriverProfileKYCProps {
  kycDocuments: KYCDocument[];
  isUpdating?: boolean;
}
