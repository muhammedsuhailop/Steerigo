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
exports.UpdateDriverLocationUseCase = void 0;
const inversify_1 = require("inversify");
const Location_1 = require("../../../domain/value-objects/Location");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverAvailabilityErrors_1 = require("../../../domain/errors/DriverAvailabilityErrors");
const UpdateDriverLocationResponseDto_1 = require("../../dto/driver/UpdateDriverLocationResponseDto");
let UpdateDriverLocationUseCase = class UpdateDriverLocationUseCase {
    constructor(availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Updating driver location", dto.getDriverId());
            const availability = await this.availabilityRepository.findActiveByDriverId(dto.getDriverId());
            if (!availability) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.DriverAvailabilityNotFoundError(dto.getDriverId()));
            }
            const newLocation = Location_1.Location.create(dto.getLocationData());
            try {
                availability.updateLocation(newLocation);
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message.includes("already up to date")) {
                    const response = new UpdateDriverLocationResponseDto_1.UpdateDriverLocationResponseDto(availability.getId(), availability.getDriverId(), availability.getCurrentLocation().getCoordinates(), availability.getUpdatedAt().toISOString());
                    return Result_1.Result.success(response);
                }
                throw error;
            }
            const updatedAvailability = await this.availabilityRepository.save(availability);
            if (!updatedAvailability) {
                return Result_1.Result.failure(new Error("Failed to update driver availability"));
            }
            const response = new UpdateDriverLocationResponseDto_1.UpdateDriverLocationResponseDto(updatedAvailability.getId(), updatedAvailability.getDriverId(), updatedAvailability.getCurrentLocation().getCoordinates(), updatedAvailability.getUpdatedAt().toISOString());
            Logger_1.Logger.info("Driver location updated successfully", {
                driverId: dto.getDriverId(),
                availabilityId: updatedAvailability.getId(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating driver location", {
                driverId: dto.getDriverId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.UpdateDriverLocationUseCase = UpdateDriverLocationUseCase;
exports.UpdateDriverLocationUseCase = UpdateDriverLocationUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __metadata("design:paramtypes", [Object])
], UpdateDriverLocationUseCase);
//# sourceMappingURL=UpdateDriverLocationUseCase.js.map