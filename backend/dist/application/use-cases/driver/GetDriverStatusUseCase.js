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
exports.GetDriverStatusUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const DriverAvailabilityErrors_1 = require("../../../domain/errors/DriverAvailabilityErrors");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverStatusMapper_1 = require("../../mappers/driver/DriverStatusMapper");
let GetDriverStatusUseCase = class GetDriverStatusUseCase {
    constructor(driverRepository, availabilityRepository) {
        this.driverRepository = driverRepository;
        this.availabilityRepository = availabilityRepository;
    }
    async execute(userId) {
        try {
            Logger_1.Logger.info("Get driver status started", { userId });
            const driver = await this.driverRepository.findByUserId(userId);
            if (!driver) {
                Logger_1.Logger.warn("Driver profile not found", { userId });
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.DriverProfileNotFoundError(userId));
            }
            const driverId = driver.getId();
            Logger_1.Logger.debug("Driver profile found", { driverId, userId });
            const availability = await this.availabilityRepository.findActiveByDriverId(driverId);
            if (!availability) {
                Logger_1.Logger.warn("Driver availability not found", { driverId });
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.DriverAvailabilityNotFoundError(driverId));
            }
            Logger_1.Logger.debug("Driver availability found", {
                driverId,
                status: availability.getStatus(),
                hasRecurringSchedule: !!availability.getRecurringSchedule(),
                exceptionsCount: availability.getExceptions().length,
            });
            const response = DriverStatusMapper_1.DriverStatusMapper.toDtoFromEntity(availability);
            Logger_1.Logger.info("Driver status fetched successfully", {
                userId,
                driverId,
                availabilityStatus: response.availabilityStatus,
                recurringScheduleActive: response.recurringSchedule?.isActive,
                activeExceptions: response.activeExceptionsCount,
                currentlyAvailable: response.summary.isCurrentlyAvailable,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching driver status", { userId, error });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(new DomainError_1.DomainError("Failed to fetch driver status. Please try again later."));
        }
    }
};
exports.GetDriverStatusUseCase = GetDriverStatusUseCase;
exports.GetDriverStatusUseCase = GetDriverStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetDriverStatusUseCase);
//# sourceMappingURL=GetDriverStatusUseCase.js.map