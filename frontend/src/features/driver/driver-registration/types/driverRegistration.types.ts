import {
  LicenseCategory,
  GearType,
  BodyType,
  DocumentType,
} from "../constants/valueObjects";

export interface DriverRegistrationState {
  currentStep: RegistrationStep;
  errors: Record<string, string>;
  uploadProgress: Record<string, number>;
  formData: DriverRegistrationData;
  isSubmitting: boolean;
  registrationSuccess: boolean;
  registrationError: string | null;
}

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
  licenseCategory: LicenseCategory;
  licenseNumber: string;
  licenseBodyTypes: BodyType[];
  licenseGearTypes: GearType[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
}

export interface DriverIdInfo {
  idType: DocumentType;
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

export interface DriverRegistrationApiResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  completionPercentage: number;
}
