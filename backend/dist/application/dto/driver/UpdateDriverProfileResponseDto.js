"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDriverProfileResponseDto = exports.DriverProfileDto = void 0;
class DriverProfileDto {
    constructor(id, userId, eligibleGearTypes, eligibleBodyTypes, kycStatus, status, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.eligibleGearTypes = eligibleGearTypes;
        this.eligibleBodyTypes = eligibleBodyTypes;
        this.kycStatus = kycStatus;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.DriverProfileDto = DriverProfileDto;
class UpdateDriverProfileResponseDto {
    constructor(driver, userUpdated, vehiclesUpdated, kycStatusUpdated, updatedFields) {
        this.driver = driver;
        this.userUpdated = userUpdated;
        this.vehiclesUpdated = vehiclesUpdated;
        this.kycStatusUpdated = kycStatusUpdated;
        this.updatedFields = updatedFields;
    }
}
exports.UpdateDriverProfileResponseDto = UpdateDriverProfileResponseDto;
//# sourceMappingURL=UpdateDriverProfileResponseDto.js.map