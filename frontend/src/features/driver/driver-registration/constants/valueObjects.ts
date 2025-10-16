export type LicenseCategory = "LMV" | "HMV" | "LMVTR" | "HPMV";
export const VALID_LICENSE_CATEGORIES: LicenseCategory[] = [
  "LMV",
  "HMV",
  "LMVTR",
  "HPMV",
];

export type GearType = "Manual" | "Automatic";
export const VALID_GEAR_TYPES: GearType[] = ["Manual", "Automatic"];

export type BodyType = "Sedan" | "SUV" | "Hatchback";
export const VALID_BODY_TYPES: BodyType[] = ["Sedan", "SUV", "Hatchback"];

export type DocumentType = "PAN" | "Aadhaar" | "DrivingLicense";
export const VALID_DOC_TYPES: DocumentType[] = [
  "PAN",
  "Aadhaar",
  "DrivingLicense",
];

export const LICENSE_CATEGORIES = [
  { value: "LMV" as LicenseCategory, label: "LMV (Light Motor Vehicle)" },
  { value: "HMV" as LicenseCategory, label: "HMV (Heavy Motor Vehicle)" },
  {
    value: "LMVTR" as LicenseCategory,
    label: "LMV-TR (Light Motor Vehicle Transport)",
  },
  {
    value: "HPMV" as LicenseCategory,
    label: "HPMV (Heavy Passenger Motor Vehicle)",
  },
];

export const BODY_TYPES = [
  { value: "Sedan" as BodyType, label: "Sedan" },
  { value: "SUV" as BodyType, label: "SUV" },
  { value: "Hatchback" as BodyType, label: "Hatchback" },
];

export const GEAR_TYPES = [
  { value: "Manual" as GearType, label: "Manual" },
  { value: "Automatic" as GearType, label: "Automatic" },
];

export const DOCUMENT_TYPES = [
  { value: "Aadhaar" as DocumentType, label: "Aadhaar Card" },
  { value: "PAN" as DocumentType, label: "PAN Card" },
  { value: "DrivingLicense" as DocumentType, label: "Driving License" },
];
