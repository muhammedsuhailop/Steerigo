import { injectable } from "inversify";
import { IDriverRepository } from "@domain/repositories/driver/IDriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverModel } from "../../models/DriverModel";

@injectable()
export class MongoDriverRepository implements IDriverRepository {
  async save(driver: Driver): Promise<void> {
    await DriverModel.findOneAndUpdate(
      { userId: driver.getUserId() },
      {
        userId: driver.getUserId(),
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
    const doc = await DriverModel.findOne({ userId });

    if (!doc) return null;

    return Driver.reconstruct({
      id: doc.id.toString(),
      userId: doc.userId,
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
