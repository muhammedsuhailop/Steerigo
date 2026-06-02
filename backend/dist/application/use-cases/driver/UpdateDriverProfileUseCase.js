"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDriverProfileUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const UpdateDriverProfileResponseDto_1 = require("@application/dto/driver/UpdateDriverProfileResponseDto");
let UpdateDriverProfileUseCase = class UpdateDriverProfileUseCase {
    constructor(driverRepository, userRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                Logger_1.Logger.warn("Profile update validation failed", {
                    userId: dto.getUserId(),
                    errors: validationErrors,
                });
                return Result_1.Result.failure(new DomainError_1.DomainError(validationErrors.join(", ")));
            }
            const hasUserUpdates = dto.hasUserProfileUpdates();
            const hasVehicleUpdates = dto.hasVehicleTypeUpdates();
            if (!hasUserUpdates && !hasVehicleUpdates) {
                Logger_1.Logger.warn("No updates provided", dto.getUserId());
                return Result_1.Result.failure(new DomainError_1.DomainError("At least one field must be provided for update"));
            }
            Logger_1.Logger.info("Driver profile update started", {
                userId: dto.getUserId(),
                hasUserUpdates,
                hasVehicleUpdates,
            });
            const user = await this.userRepository.findById(dto.getUserId());
            if (!user) {
                Logger_1.Logger.warn("User not found", dto.getUserId());
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                Logger_1.Logger.warn("Driver profile not found", dto.getUserId());
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver profile not found"));
            }
            const updatedFields = [];
            let userUpdated = false;
            let vehiclesUpdated = false;
            let kycStatusUpdated = false;
            if (hasUserUpdates) {
                const userUpdates = dto.getUserProfileUpdates();
                user.updateProfile(userUpdates);
                await this.userRepository.save(user);
                userUpdated = true;
                updatedFields.push("userProfile");
                Logger_1.Logger.info("User profile updated", {
                    userId: dto.getUserId(),
                    updates: Object.keys(userUpdates),
                });
            }
            if (hasVehicleUpdates) {
                const gearTypes = dto.getEligibleGearTypes();
                const bodyTypes = dto.getEligibleBodyTypes();
                if (gearTypes && bodyTypes) {
                    driver.updateEligibleVehicles(gearTypes, bodyTypes);
                    vehiclesUpdated = true;
                    updatedFields.push("eligibleVehicles");
                    Logger_1.Logger.info("Eligible vehicles updated", {
                        userId: dto.getUserId(),
                        gearTypes,
                        bodyTypes,
                    });
                    driver.updateKycStatus(KYCStatus_1.KYCStatus.IN_REVIEW);
                    kycStatusUpdated = true;
                    updatedFields.push("kycStatus");
                    Logger_1.Logger.info("KYC status set to InReview due to vehicle type update", {
                        userId: dto.getUserId(),
                        kycStatus: KYCStatus_1.KYCStatus.IN_REVIEW,
                    });
                }
            }
            if (vehiclesUpdated || kycStatusUpdated) {
                await this.driverRepository.save(driver);
                Logger_1.Logger.info("Driver information persisted to database", {
                    userId: dto.getUserId(),
                    fields: updatedFields.filter((f) => f === "eligibleVehicles" || f === "kycStatus"),
                });
            }
            const updatedDriver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!updatedDriver) {
                Logger_1.Logger.error("Failed to retrieve updated driver", dto.getUserId());
                return Result_1.Result.failure(new DomainError_1.DomainError("Failed to retrieve updated driver"));
            }
            const driverProfileDto = new UpdateDriverProfileResponseDto_1.DriverProfileDto(updatedDriver.getId(), updatedDriver.getUserId(), updatedDriver.getEligibleGearTypes(), updatedDriver.getEligibleBodyTypes(), updatedDriver.getKycStatus(), updatedDriver.getStatus(), updatedDriver.getCreatedAt(), updatedDriver.getUpdatedAt());
            const response = new UpdateDriverProfileResponseDto_1.UpdateDriverProfileResponseDto(driverProfileDto, userUpdated, vehiclesUpdated, kycStatusUpdated, updatedFields);
            Logger_1.Logger.info("Driver profile update successful", {
                userId: dto.getUserId(),
                updatedFields,
                totalFields: updatedFields.length,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Driver profile update failed", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to update driver profile. Please try again later"));
        }
    }
};
exports.UpdateDriverProfileUseCase = UpdateDriverProfileUseCase;
exports.UpdateDriverProfileUseCase = UpdateDriverProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateDriverProfileUseCase);
//# sourceMappingURL=UpdateDriverProfileUseCase.js.map