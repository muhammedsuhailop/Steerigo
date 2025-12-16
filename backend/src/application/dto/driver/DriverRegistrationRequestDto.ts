import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { Gender } from "@domain/value-objects/Gender";

interface DriverRegistrationRequestBody {
  name: string;
  mobile: string;
  dob: string;
  gender: Gender;
  state: string;
  pin: string;
  address: string;
  licenseCategory: LicenseCategory;
  licenseNumber: string;
  licenseBodyTypes: BodyType[];
  licenseGearTypes: GearType[];
  licenseIssueDate: string;
  licenseExpiryDate: string;
  idType: DocumentType;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate?: string;
  licenseFrontImage: string;
  licenseBackImage: string;
  idFrontImage: string;
  idBackImage: string;
}

export class DriverRegistrationRequestDto {
  constructor(
    private readonly userId: string,
    private readonly name: string,
    private readonly mobile: string,
    private readonly dob: Date,
    private readonly gender: Gender,
    private readonly state: string,
    private readonly pin: string,
    private readonly address: string,
    private readonly licenseCategory: LicenseCategory,
    private readonly licenseNumber: string,
    private readonly licenseBodyTypes: BodyType[],
    private readonly licenseGearTypes: GearType[],
    private readonly licenseIssueDate: Date,
    private readonly licenseExpiryDate: Date,
    private readonly idType: DocumentType,
    private readonly idNumber: string,
    private readonly idIssueDate: Date,
    private readonly idExpiryDate: Date | null,
    private readonly licenseFrontImage: string,
    private readonly licenseBackImage: string,
    private readonly idFrontImage: string,
    private readonly idBackImage: string
  ) {}

  static fromRequest(
    userId: string,
    body: DriverRegistrationRequestBody
  ): DriverRegistrationRequestDto {
    return new DriverRegistrationRequestDto(
      userId,
      body.name,
      body.mobile,
      new Date(body.dob),
      body.gender,
      body.state,
      body.pin,
      body.address,
      body.licenseCategory,
      body.licenseNumber,
      body.licenseBodyTypes,
      body.licenseGearTypes,
      new Date(body.licenseIssueDate),
      new Date(body.licenseExpiryDate),
      body.idType,
      body.idNumber,
      new Date(body.idIssueDate),
      body.idExpiryDate && body.idExpiryDate.trim() !== ""
        ? new Date(body.idExpiryDate)
        : null,
      body.licenseFrontImage,
      body.licenseBackImage,
      body.idFrontImage,
      body.idBackImage
    );
  }

  // User profile getters

  getUserId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getMobile(): string {
    return this.mobile;
  }

  getDob(): Date {
    return this.dob;
  }

  getGender(): Gender {
    return this.gender;
  }

  getState(): string {
    return this.state;
  }

  getPin(): string {
    return this.pin;
  }

  getAddress(): string {
    return this.address;
  }

  getFullAddress(): string {
    return `${this.address}, ${this.state}, ${this.pin}`;
  }

  // Driver license getters

  getLicenseCategory(): LicenseCategory {
    return this.licenseCategory;
  }

  getLicenseNumber(): string {
    return this.licenseNumber;
  }

  getEligibleBodyTypes(): BodyType[] {
    return this.licenseBodyTypes;
  }

  getEligibleGearTypes(): GearType[] {
    return this.licenseGearTypes;
  }

  getLicenseIssueDate(): Date {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date {
    return this.licenseExpiryDate;
  }

  // ID doc getters

  getIdType(): DocumentType {
    return this.idType;
  }

  getIdNumber(): string {
    return this.idNumber;
  }

  getIdIssueDate(): Date {
    return this.idIssueDate;
  }

  getIdExpiryDate(): Date | null {
    return this.idExpiryDate;
  }

  // Image getters
  getLicenseFrontImage(): string {
    return this.licenseFrontImage;
  }

  getLicenseBackImage(): string {
    return this.licenseBackImage;
  }

  getIdFrontImage(): string {
    return this.idFrontImage;
  }

  getIdBackImage(): string {
    return this.idBackImage;
  }

  getLicenseImageUrls(): { front: string[]; back: string[] } {
    return {
      front: [this.licenseFrontImage],
      back: [this.licenseBackImage],
    };
  }

  getIdImageUrls(): { front: string[]; back: string[] } {
    return {
      front: [this.idFrontImage],
      back: [this.idBackImage],
    };
  }
}
