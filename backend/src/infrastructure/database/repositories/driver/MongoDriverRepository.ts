import { injectable } from "inversify";
import { IDriverRepository } from "@domain/repositories/driver/IDriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverModel } from "../../models/DriverModel";
import { Types } from "mongoose";

@injectable()
export class MongoDriverRepository implements IDriverRepository {
  async save(driver: Driver): Promise<void> {
    const userObjectId = new Types.ObjectId(driver.getUserId());
    await DriverModel.findOneAndUpdate(
      { userId: userObjectId },
      {
        userId: userObjectId,
        licenseNumber: driver.getLicenseNumber(),
        licenseIssueDate: driver.getLicenseIssueDate(),
        licenseExpiryDate: driver.getLicenseExpiryDate(),
        licenseCategory: driver.getLicenseCategory(),
        kycStatus: driver.getKycStatus(),
        status: driver.getStatus(),
        eligibleVehicleType: driver.getEligibleVehicleType(),
        eligibleGearType: driver.getEligibleGearType(),
      },
      { upsert: true }
    );
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    const userObjectId = new Types.ObjectId(userId);

    const doc = await DriverModel.findOne({ userId: userObjectId });

    if (!doc) return null;

    return Driver.reconstruct({
      id: doc.id.toString(),
      userId: doc.userId.toString(),
      licenseNumber: doc.licenseNumber,
      licenseIssueDate: doc.licenseIssueDate,
      licenseExpiryDate: doc.licenseExpiryDate,
      licenseCategory: doc.licenseCategory,
      kycStatus: doc.kycStatus as "Pending" | "Verified" | "Rejected",
      status: doc.status as "Active" | "Blocked" | "InReview",
      eligibleVehicleType: doc.eligibleVehicleType,
      eligibleGearType: doc.eligibleGearType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
