export interface LicenseInfo {
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseVerified: boolean;
}

export interface KYCDocument {
  docId: string;
  docType: "Aadhaar" | "License" | "PAN" | "DrivingLicense";
  docNumberMasked: string;
  issueDate: string;
  expiryDate: string;
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  verificationStatus: "Pending" | "InReview" | "Verified" | "Rejected";
  createdAt: string;
  updatedAt: string;
  comments?: string;
}

export interface KYCInfo {
  overallStatus: "Pending" | "InReview" | "Verified" | "Rejected" | "Approved";
  docs: KYCDocument[];
}

export interface DriverProfile {
  driverId: string;
  userId: string;
  name: string;
  profileImageUrl: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
  isVerified: boolean;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  license: LicenseInfo;
  kyc: KYCInfo;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  meta: {
    lastUpdated: string;
    serverTime: string;
  };
}

export type DriverProfileResponse = DriverProfile;

export interface DriverProfileState {
  profile: DriverProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

export interface KYCDocumentProps {
  document: KYCDocument;
  isLoading?: boolean;
  onUpdate?: (docId: string, status: string) => void;
}

export interface LicenseInfoProps {
  license: LicenseInfo;
  isVerified: boolean;
}

export interface DriverProfileHeaderProps {
  profile: DriverProfile;
  isLoading?: boolean;
  onEditClick?: () => void;
}

export interface DriverProfileDetailsProps {
  profile: DriverProfile;
  isLoading?: boolean;
}

export interface DriverKYCStatusProps {
  kyc: KYCInfo;
  isLoading?: boolean;
}

export interface KYCPayload {
  docType: string;
  docNumber: string;
  licenseCategory?: string;
  issueDate: string;
  expiryDate?: string;
  frontImageUrls: string[];
  backImageUrls: string[];
}

export interface AddKYCResult {
  success: boolean;
  error?: string;
}

export interface AddKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface ImageData {
  url: string;
  publicId: string;
}

export interface DriverKYCStatusExtendedProps extends DriverKYCStatusProps {
  onDocumentAdded?: () => void;
  onAddKYCClick?: () => void;
}

export interface ImageModalState {
  isOpen: boolean;
  imageUrl: string;
  imageType: "Front" | "Back";
  title: string;
}
