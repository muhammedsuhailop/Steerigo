import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";

export class DriverRegistrationRequestDto {
  constructor(
    private readonly eligibleGearTypes: GearType[],
    private readonly eligibleBodyTypes: BodyType[],
    private readonly licenceCategory: LicenseCategory,
    private readonly licenseIssueDate: Date,
    private readonly licenseExpiryDate: Date
  ) {}

  getEligibleGearTypes(): GearType[] {
    return this.eligibleGearTypes;
  }

  getEligibleBodyTypes(): BodyType[] {
    return this.eligibleBodyTypes;
  }

  getLicenceCategory(): LicenseCategory {
    return this.licenceCategory;
  }

  getLicenseIssueDate(): Date {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date {
    return this.licenseExpiryDate;
  }
}
