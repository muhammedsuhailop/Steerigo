import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { DocumentType } from "@domain/value-objects/DocumentType";

export class DriverProfileUpdateDto {
  constructor(
    private readonly name?: string,
    private readonly mobile?: string,
    private readonly dob?: Date,
    private readonly gender?: "Male" | "Female" | "Other",
    private readonly state?: string,
    private readonly pin?: string,
    private readonly address?: string,

    private readonly eligibleGearTypes?: GearType[],
    private readonly eligibleBodyTypes?: BodyType[],
    private readonly licenceCategory?: LicenseCategory,
    private readonly licenseNumber?: string,
    private readonly licenseIssueDate?: Date,
    private readonly licenseExpiryDate?: Date,

    private readonly idType?: DocumentType,
    private readonly idNumber?: string,
    private readonly idIssueDate?: Date,
    private readonly idExpiryDate?: Date,

    private readonly licenseFrontImage?: string,
    private readonly licenseBackImage?: string,
    private readonly idFrontImage?: string,
    private readonly idBackImage?: string
  ) {}

  getName(): string | undefined {
    return this.name;
  }

  getMobile(): string | undefined {
    return this.mobile;
  }

  getDob(): Date | undefined {
    return this.dob;
  }

  getGender(): "Male" | "Female" | "Other" | undefined {
    return this.gender;
  }

  getState(): string | undefined {
    return this.state;
  }

  getPin(): string | undefined {
    return this.pin;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  getFullAddress(): string | undefined {
    if (!this.address || !this.state || !this.pin) {
      return undefined;
    }
    return `${this.address}, ${this.state}, ${this.pin}`;
  }

  getEligibleGearTypes(): GearType[] | undefined {
    return this.eligibleGearTypes;
  }

  getEligibleBodyTypes(): BodyType[] | undefined {
    return this.eligibleBodyTypes;
  }

  getLicenceCategory(): LicenseCategory | undefined {
    return this.licenceCategory;
  }

  getLicenseNumber(): string | undefined {
    return this.licenseNumber;
  }

  getLicenseIssueDate(): Date | undefined {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date | undefined {
    return this.licenseExpiryDate;
  }

  getIdType(): DocumentType | undefined {
    return this.idType;
  }

  getIdNumber(): string | undefined {
    return this.idNumber;
  }

  getIdIssueDate(): Date | undefined {
    return this.idIssueDate;
  }

  getIdExpiryDate(): Date | undefined {
    return this.idExpiryDate;
  }

  getLicenseFrontImage(): string | undefined {
    return this.licenseFrontImage;
  }

  getLicenseBackImage(): string | undefined {
    return this.licenseBackImage;
  }

  getIdFrontImage(): string | undefined {
    return this.idFrontImage;
  }

  getIdBackImage(): string | undefined {
    return this.idBackImage;
  }

  hasUserProfileUpdates(): boolean {
    return !!(
      this.name ||
      this.mobile ||
      this.dob ||
      this.gender ||
      this.state ||
      this.pin ||
      this.address
    );
  }

  hasDriverLicenseUpdates(): boolean {
    return !!(
      this.eligibleGearTypes ||
      this.eligibleBodyTypes ||
      this.licenceCategory ||
      this.licenseNumber ||
      this.licenseIssueDate ||
      this.licenseExpiryDate
    );
  }

  hasKycDocumentUpdates(): boolean {
    return !!(
      this.idType ||
      this.idNumber ||
      this.idIssueDate ||
      this.idExpiryDate ||
      this.licenseFrontImage ||
      this.licenseBackImage ||
      this.idFrontImage ||
      this.idBackImage
    );
  }

  getUserProfileUpdates(): {
    name?: string;
    mobile?: string;
    dob?: Date;
    gender?: string;
    address?: string;
  } {
    const updates: any = {};
    if (this.name) updates.name = this.name;
    if (this.mobile) updates.mobile = this.mobile;
    if (this.dob) updates.dob = this.dob;
    if (this.gender) updates.gender = this.gender;
    if (this.getFullAddress()) updates.address = this.getFullAddress();
    return updates;
  }
}
