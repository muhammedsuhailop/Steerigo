import { Driver } from "@domain/entities/Driver";
import { IDriverModel } from "../models/DriverModel";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "@domain/value-objects/VehicleType";
import { Types } from "mongoose";

export class DriverMapper {
  static toDomain(raw: IDriverModel): Driver {
    return Driver.fromData({
      id: raw._id.toString(),
      userId: raw.userId.toString(),
      eligibleGearTypes: raw.eligibleGearTypes as GearType[],
      eligibleBodyTypes: raw.eligibleBodyTypes as BodyType[],
      licenseNumber: raw.licenseNumber,
      licenceCategory: raw.licenceCategory as LicenseCategory,
      licenseIssueDate: raw.licenseIssueDate,
      licenseExpiryDate: raw.licenseExpiryDate,
      kycStatus: raw.kycStatus as KYCStatus,
      status: raw.status as DriverStatus,
      averageRating: raw.averageRating ?? 0,
      numberOfRatings: raw.numberOfRatings ?? 0,
      totalRides: raw.totalRides ?? 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(driver: Driver): Partial<IDriverModel> {
    return {
      _id: new Types.ObjectId(driver.getId()),
      userId: new Types.ObjectId(driver.getUserId()),
      eligibleGearTypes: driver.getEligibleGearTypes(),
      eligibleBodyTypes: driver.getEligibleBodyTypes(),
      licenseNumber: driver.getLicenseNumber(),
      licenceCategory: driver.getLicenceCategory(),
      licenseIssueDate: driver.getLicenseIssueDate(),
      licenseExpiryDate: driver.getLicenseExpiryDate(),
      kycStatus: driver.getKycStatus(),
      status: driver.getStatus(),
      averageRating: driver.getAverageRating(),
      numberOfRatings: driver.getNumberOfRatings(),
      totalRides: driver.getTotalRides(),
      updatedAt: driver.getUpdatedAt(),
    };
  }
}
