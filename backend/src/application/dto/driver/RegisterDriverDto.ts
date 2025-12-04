export interface RegisterDriverInput {
  // Personal Information
  name?: string;
  mobile?: string;
  dob?: string;
  gender?: string;
  state?: string;
  pin?: string;
  address?: string;

  // License Information
  bodyTypes?: string[] | string;
  gearTypes?: string[] | string;
  licenseNumber?: string;
  licenseCategory?: string[] | string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;

  // ID Information
  idType?: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
  idNumber?: string;
  idIssueDate?: string;
  idExpiryDate?: string;

  // Document Images
  licenseFrontImage?: string;
  licenseBackImage?: string;
  idFrontImage?: string;
  idBackImage?: string;
}

export class RegisterDriverDto {
  // Personal Information
  public readonly name: string;
  public readonly mobile: string;
  public readonly dob: string;
  public readonly gender: string;
  public readonly state: string;
  public readonly pin: string;
  public readonly address: string;

  // License Information
  public readonly bodyTypes: string[];
  public readonly gearTypes: string[];
  public readonly licenseNumber: string;
  public readonly licenseCategory: string[];
  public readonly licenseIssueDate: string;
  public readonly licenseExpiryDate: string;

  // ID Information
  public readonly idType: "PAN" | "Aadhaar" | "DrivingLicense" | "Passport";
  public readonly idNumber: string;
  public readonly idIssueDate: string;
  public readonly idExpiryDate: string;

  // Document Images
  public readonly licenseFrontImage: string;
  public readonly licenseBackImage: string;
  public readonly idFrontImage: string;
  public readonly idBackImage: string;

  constructor(data: unknown) {
    const input = (data ?? {}) as RegisterDriverInput;

    // Basic information
    this.name = input.name ?? "";
    this.mobile = input.mobile ?? "";
    this.dob = input.dob ?? "";
    this.gender = input.gender ?? "";
    this.state = input.state ?? "";
    this.pin = input.pin ?? "";
    this.address = input.address ?? "";

    // Array parsing helper
    const parseArray = (value: string[] | string | undefined): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      }
      return [];
    };

    // Handle JSON/array fields
    this.bodyTypes = parseArray(input.bodyTypes);
    this.gearTypes = parseArray(input.gearTypes);
    this.licenseCategory = parseArray(input.licenseCategory);

    this.licenseNumber = input.licenseNumber ?? "";
    this.licenseIssueDate = input.licenseIssueDate ?? "";
    this.licenseExpiryDate = input.licenseExpiryDate ?? "";

    this.idType = input.idType ?? "DrivingLicense"; 
    this.idNumber = input.idNumber ?? "";
    this.idIssueDate = input.idIssueDate ?? "";
    this.idExpiryDate = input.idExpiryDate ?? "";

    this.licenseFrontImage = input.licenseFrontImage ?? "";
    this.licenseBackImage = input.licenseBackImage ?? "";
    this.idFrontImage = input.idFrontImage ?? "";
    this.idBackImage = input.idBackImage ?? "";
  }

  public getFullAddress(): string {
    return `${this.address}, ${this.state}, ${this.pin}`;
  }
}
