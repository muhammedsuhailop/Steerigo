export interface DriverPersonalInfo {
  name: string;
  mobile: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  state: string;
  pin: string;
  address: string;
}

export interface DriverLicenseInfo {
  bodyTypes: string[];
  gearTypes: string[];
  licenseCategory: string[];
  licenseNumber: string;
  licenseBodyTypes: string[];
  licenseGearTypes: string[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
}

export interface DriverIdInfo {
  idType: "PAN" | "Aadhaar" | "DrivingLicense";
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
}

export interface DriverDocuments {
  licenseFrontImage?: File | string;
  licenseBackImage?: File | string;
  idFrontImage?: File | string;
  idBackImage?: File | string;
}

export interface DriverRegistrationData
  extends DriverPersonalInfo,
    DriverLicenseInfo,
    DriverIdInfo,
    DriverDocuments {}

export interface UploadResponse {
  success: boolean;
  publicId?: string;
  message?: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
    purpose: string;
    filename: string;
    size: number;
    uploadedAt: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export enum RegistrationStep {
  PERSONAL_INFO = 0,
  LICENSE_INFO = 1,
  ID_INFO = 2,
  DOCUMENTS = 3,
  REVIEW = 4,
}

export const LICENSE_CATEGORIES = [
  { value: "LMV", label: "LMV (Light Motor Vehicle)" },
  { value: "HMV", label: "HMV (Heavy Motor Vehicle)" },
  { value: "LMVTR", label: "LMV-TR (Light Motor Vehicle Transport)" },
  { value: "HPMV", label: "HPMV (Heavy Passenger Motor Vehicle)" },
];

export const BODY_TYPES = [
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Hatchback", label: "Hatchback" },
];

export const GEAR_TYPES = [
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
];

export interface PincodeDetails {
  state: string;
  district: string;
  postOffice: string;
}

export const FILE_UPLOAD_PURPOSES = {
  licenseFrontImage: "licenseFront",
  licenseBackImage: "licenseBack",
  idFrontImage: "kycdocFront",
  idBackImage: "kycdocBack",
  avatar: "avatar",
  insurance: "insurance",
  profile: "profile",
  document: "document",
} as const;

export type FileUploadPurpose =
  (typeof FILE_UPLOAD_PURPOSES)[keyof typeof FILE_UPLOAD_PURPOSES];
