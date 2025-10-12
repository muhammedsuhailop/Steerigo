import { Driver } from "@domain/entities/Driver";
import { IDriverModel } from "../models/DriverModel";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";

export class DriverMapper {
  static toDomain(raw: IDriverModel): Driver {
    return Driver.fromData({
      id: raw._id,
      userId: raw.userId,
      eligibleGearTypes: raw.eligibleGearTypes as GearType[],
      eligibleBodyTypes: raw.eligibleBodyTypes as BodyType[],
      licenceCategory: raw.licenceCategory as LicenseCategory,
      licenseIssueDate: raw.licenseIssueDate,
      licenseExpiryDate: raw.licenseExpiryDate,
      kycStatus: raw.kycStatus as KYCStatus,
      status: raw.status as DriverStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(driver: Driver): Partial<IDriverModel> {
    return {
      _id: driver.getId(),
      userId: driver.getUserId(),
      eligibleGearTypes: driver.getEligibleGearTypes(),
      eligibleBodyTypes: driver.getEligibleBodyTypes(),
      licenceCategory: driver.getLicenceCategory(),
      licenseIssueDate: driver.getLicenseIssueDate(),
      licenseExpiryDate: driver.getLicenseExpiryDate(),
      kycStatus: driver.getKycStatus(),
      status: driver.getStatus(),
      updatedAt: driver.getUpdatedAt(),
    };
  }
}
