import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";

export interface DriverResponseDto {
  id: string;
  userId: string;
  eligibleGearTypes: GearType[];
  eligibleBodyTypes: BodyType[];
  licenceCategory: LicenseCategory;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  kycStatus: KYCStatus;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}
