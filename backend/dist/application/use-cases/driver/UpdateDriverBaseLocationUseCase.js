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
exports.UpdateDriverBaseLocationUseCase = void 0;
const inversify_1 = require("inversify");
const Location_1 = require("../../../domain/value-objects/Location");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverAvailabilityErrors_1 = require("../../../domain/errors/DriverAvailabilityErrors");
let UpdateDriverBaseLocationUseCase = class UpdateDriverBaseLocationUseCase {
    constructor(availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Updating driver base location", {
                driverId: dto.getDriverId(),
            });
            const availability = await this.availabilityRepository.findActiveByDriverId(dto.getDriverId());
            if (!availability) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.DriverAvailabilityNotFoundError(dto.getDriverId()));
            }
            const newBaseLocation = Location_1.Location.create(dto.getBaseLocationData());
            availability.updateBaseLocation(newBaseLocation);
            const updatedAvailability = await this.availabilityRepository.save(availability);
            if (!updatedAvailability) {
                return Result_1.Result.failure(new Error("Failed to update driver base location"));
            }
            const baseLocation = updatedAvailability.getBaseLocation();
            if (!baseLocation) {
                return Result_1.Result.failure(new Error("Failed to update driver base location"));
            }
            const response = {
                availabilityId: updatedAvailability.getId(),
                driverId: updatedAvailability.getDriverId(),
                baseLocation: baseLocation.getCoordinates(),
                updatedAt: updatedAvailability.getUpdatedAt().toISOString(),
            };
            Logger_1.Logger.info("Driver base location updated successfully", {
                driverId: dto.getDriverId(),
                availabilityId: updatedAvailability.getId(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating driver base location", {
                driverId: dto.getDriverId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.UpdateDriverBaseLocationUseCase = UpdateDriverBaseLocationUseCase;
exports.UpdateDriverBaseLocationUseCase = UpdateDriverBaseLocationUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __metadata("design:paramtypes", [Object])
], UpdateDriverBaseLocationUseCase);
//# sourceMappingURL=UpdateDriverBaseLocationUseCase.js.map