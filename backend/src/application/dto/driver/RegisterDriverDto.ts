export class RegisterDriverDto {
  public readonly name: string;
  public readonly mobile: string;
  public readonly dob: string;
  public readonly gender: string;
  public readonly state: string;
  public readonly pin: string;
  public readonly address: string;
  public readonly vehicleTypes: string[];
  public readonly gearTypes: string[];
  public readonly licenseNumber: string;
  public readonly licenseCategory: string;
  public readonly licenseIssueDate: string;
  public readonly licenseExpiryDate: string;
  public readonly licenseBodyTypes: string[];
  public readonly licenseGearTypes: string[];
  public readonly idType: "PAN" | "Aadhaar" | "DrivingLicense";
  public readonly idNumber: string;
  public readonly idIssueDate: string;
  public readonly idExpiryDate: string;
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
    this.vehicleTypes = data.vehicleTypes;
    this.gearTypes = data.gearTypes;
    this.licenseNumber = data.licenseNumber;
    this.licenseCategory = data.licenseCategory;
    this.licenseBodyTypes = data.licenseBodyTypes;
    this.licenseGearTypes = data.licenseGearTypes;
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
