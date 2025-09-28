export interface DriverPersonalInfo {
  name: string;
  mobile: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  state: string;
  pin: string;
  address: string;
}

export interface DriverVehicleInfo {
  vehicleTypes: string[];
  gearTypes: string[];
}

export interface DriverLicenseInfo {
  licenseCategory: string;
  licenseNumber: string;
  licenseBodyTypes: string[];
  licenseGearTypes: string[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
}

export interface DriverIdInfo {
  idType: string;
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
    DriverVehicleInfo,
    DriverLicenseInfo,
    DriverIdInfo,
    DriverDocuments {}

export interface RegistrationState {
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, string>;
  uploadProgress: Record<string, number>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export enum RegistrationStep {
  PERSONAL_INFO = 0,
  VEHICLE_INFO = 1,
  LICENSE_INFO = 2,
  ID_INFO = 3,
  DOCUMENTS = 4,
  REVIEW = 5,
}

export interface DriverRegistrationState extends RegistrationState {
  formData: Partial<DriverRegistrationData>;
  isSubmitting: boolean;
  registrationSuccess: boolean;
  registrationError: string | null;
}
