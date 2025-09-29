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
  public readonly idType: "PAN" | "Aadhaar" | "DrivingLicense";
  public readonly idNumber: string;
  public readonly idIssueDate: string;
  public readonly idExpiryDate: string;

  // Document Images
  public readonly licenseFrontImage: string;
  public readonly licenseBackImage: string;
  public readonly idFrontImage: string;
  public readonly idBackImage: string;

  constructor(data: any) {
    this.name = data.name;
    this.mobile = data.mobile;
    this.dob = data.dob;
    this.gender = data.gender;
    this.state = data.state;
    this.pin = data.pin;
    this.address = data.address;

    // Handle arrays
    this.bodyTypes = Array.isArray(data.bodyTypes)
      ? data.bodyTypes
      : JSON.parse(data.bodyTypes || "[]");
    this.gearTypes = Array.isArray(data.gearTypes)
      ? data.gearTypes
      : JSON.parse(data.gearTypes || "[]");
    this.licenseCategory = Array.isArray(data.licenseCategory)
      ? data.licenseCategory
      : JSON.parse(data.licenseCategory || "[]");
    this.licenseNumber = data.licenseNumber;
    this.licenseIssueDate = data.licenseIssueDate;
    this.licenseExpiryDate = data.licenseExpiryDate;

    this.idType = data.idType;
    this.idNumber = data.idNumber;
    this.idIssueDate = data.idIssueDate;
    this.idExpiryDate = data.idExpiryDate;

    this.licenseFrontImage = data.licenseFrontImage;
    this.licenseBackImage = data.licenseBackImage;
    this.idFrontImage = data.idFrontImage;
    this.idBackImage = data.idBackImage;
  }

  public getFullAddress(): string {
    return `${this.address}, ${this.state}, ${this.pin}`;
  }
}
