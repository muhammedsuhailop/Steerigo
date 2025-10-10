import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";

export class DriverUpdateRequestDto {
  constructor(
    private readonly eligibleGearTypes?: GearType[],
    private readonly eligibleBodyTypes?: BodyType[],
    private readonly licenceCategory?: LicenseCategory,
    private readonly licenseIssueDate?: Date,
    private readonly licenseExpiryDate?: Date
  ) {}

  getEligibleGearTypes(): GearType[] | undefined {
    return this.eligibleGearTypes;
  }

  getEligibleBodyTypes(): BodyType[] | undefined {
    return this.eligibleBodyTypes;
  }

  getLicenceCategory(): LicenseCategory | undefined {
    return this.licenceCategory;
  }

  getLicenseIssueDate(): Date | undefined {
    return this.licenseIssueDate;
  }

  getLicenseExpiryDate(): Date | undefined {
    return this.licenseExpiryDate;
  }
}
