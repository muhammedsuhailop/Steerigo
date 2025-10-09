import { Driver } from "@domain/entities/Driver";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { IDriverModel } from "../models/DriverModel";

export class DriverDomainMapper {
  static toDomain(model: IDriverModel): Driver {
    return Driver.fromData({
      id: model._id.toString(),
      userId: model.userId,
      eligibleGearTypes: model.eligibleGearTypes as GearType[],
      eligibleBodyTypes: model.eligibleBodyTypes as BodyType[],
      licenceCategory: model.licenceCategory as LicenseCategory,
      licenseIssueDate: model.licenseIssueDate,
      licenseExpiryDate: model.licenseExpiryDate,
      kycStatus: model.kycStatus as KYCStatus,
      status: model.status as DriverStatus,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(driver: Driver): Partial<IDriverModel> {
    return {
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
