"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverMapper = void 0;
const Driver_1 = require("../../../domain/entities/Driver");
const mongoose_1 = require("mongoose");
class DriverMapper {
    static toDomain(raw) {
        return Driver_1.Driver.fromData({
            id: raw._id.toString(),
            userId: raw.userId.toString(),
            eligibleGearTypes: raw.eligibleGearTypes,
            eligibleBodyTypes: raw.eligibleBodyTypes,
            licenseNumber: raw.licenseNumber,
            licenceCategory: raw.licenceCategory,
            licenseIssueDate: raw.licenseIssueDate,
            licenseExpiryDate: raw.licenseExpiryDate,
            kycStatus: raw.kycStatus,
            status: raw.status,
            averageRating: raw.averageRating ?? 0,
            numberOfRatings: raw.numberOfRatings ?? 0,
            totalRides: raw.totalRides ?? 0,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toPersistence(driver) {
        return {
            _id: new mongoose_1.Types.ObjectId(driver.getId()),
            userId: new mongoose_1.Types.ObjectId(driver.getUserId()),
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
exports.DriverMapper = DriverMapper;
//# sourceMappingURL=DriverMapper.js.map