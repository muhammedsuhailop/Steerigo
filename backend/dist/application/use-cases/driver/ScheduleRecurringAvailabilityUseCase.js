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
exports.ScheduleRecurringAvailabilityUseCase = void 0;
const inversify_1 = require("inversify");
const DriverAvailabilityResponseDto_1 = require("../../dto/driver/DriverAvailabilityResponseDto");
const DriverAvailability_1 = require("../../../domain/entities/DriverAvailability");
const Location_1 = require("../../../domain/value-objects/Location");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverAvailabilityErrors_1 = require("../../../domain/errors/DriverAvailabilityErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
const mongoose_1 = require("mongoose");
const TimeSlot_1 = require("../../../domain/value-objects/TimeSlot");
let ScheduleRecurringAvailabilityUseCase = class ScheduleRecurringAvailabilityUseCase {
    constructor(availabilityRepository, driverRepository) {
        this.availabilityRepository = availabilityRepository;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Scheduling recurring driver availability", {
                userId: dto.getUserId(),
            });
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.InvalidAvailabilityScheduleError(validationErrors.join(", ")));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId();
            Logger_1.Logger.info("Clearing existing exceptions for driver", { driverId });
            const exceptions = await this.availabilityRepository.getExceptions(driverId);
            if (exceptions && exceptions.length > 0) {
                for (const exception of exceptions) {
                    await this.availabilityRepository.removeException(driverId, exception.id);
                    Logger_1.Logger.debug("Exception removed", {
                        driverId,
                        exceptionId: exception.id,
                    });
                }
                Logger_1.Logger.info("All exceptions cleared successfully", {
                    driverId,
                    clearedCount: exceptions.length,
                });
            }
            let existingAvailability = await this.availabilityRepository.findActiveByDriverId(driverId);
            if (!existingAvailability) {
                const allAvailability = await this.availabilityRepository.findByDriverId(driverId);
                if (allAvailability) {
                    existingAvailability = allAvailability;
                }
            }
            let savedAvailability;
            if (existingAvailability) {
                Logger_1.Logger.info("Updating existing recurring schedule", { driverId });
                existingAvailability.updateRecurringSchedule({
                    daysOfWeek: dto.getDaysOfWeek(),
                    timeSlots: dto.getTimeSlots(),
                    excludedTimeSlots: dto.getExcludedTimeSlots(),
                }, {
                    startDate: dto.getValidityStartDate(),
                    endDate: dto.getValidityEndDate(),
                }, dto.getNotes());
                const location = Location_1.Location.create(dto.getLocationData());
                existingAvailability.updateLocation(location);
                existingAvailability.schedule();
                savedAvailability =
                    await this.availabilityRepository.save(existingAvailability);
                Logger_1.Logger.info("Recurring schedule updated successfully", {
                    driverId,
                    availabilityId: savedAvailability.getId(),
                });
            }
            else {
                Logger_1.Logger.info("Creating new recurring schedule", { driverId });
                const availabilityId = new mongoose_1.Types.ObjectId().toString();
                const location = Location_1.Location.create(dto.getLocationData());
                const availability = DriverAvailability_1.DriverAvailability.createRecurring(availabilityId, driverId, {
                    daysOfWeek: dto.getDaysOfWeek(),
                    timeSlots: dto.getTimeSlots(),
                    excludedTimeSlots: dto.getExcludedTimeSlots(),
                }, {
                    startDate: dto.getValidityStartDate(),
                    endDate: dto.getValidityEndDate(),
                }, location, location, dto.getNotes());
                savedAvailability =
                    await this.availabilityRepository.save(availability);
                Logger_1.Logger.info("Recurring schedule created successfully", {
                    driverId,
                    availabilityId: savedAvailability.getId(),
                });
            }
            const response = this.buildResponseDto(savedAvailability);
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error scheduling recurring availability", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    buildResponseDto(availability) {
        const recurringSchedule = availability.getRecurringSchedule();
        const location = availability.getCurrentLocation().getCoordinates();
        let recurringScheduleDto = undefined;
        if (recurringSchedule) {
            const timeSlotDtos = recurringSchedule.dailyRecurrence.timeSlots.map((slot) => ({
                startTime: slot.getStartTime(),
                endTime: slot.getEndTime(),
                displayStartTime: TimeSlot_1.TimeSlot.minutesToTime(slot.getStartTime()),
                displayEndTime: TimeSlot_1.TimeSlot.minutesToTime(slot.getEndTime()),
            }));
            const excludedTimeSlotDtos = recurringSchedule.dailyRecurrence
                .excludedTimeSlots
                ? recurringSchedule.dailyRecurrence.excludedTimeSlots.map((slot) => ({
                    startTime: slot.getStartTime(),
                    endTime: slot.getEndTime(),
                    displayStartTime: TimeSlot_1.TimeSlot.minutesToTime(slot.getStartTime()),
                    displayEndTime: TimeSlot_1.TimeSlot.minutesToTime(slot.getEndTime()),
                }))
                : undefined;
            recurringScheduleDto = {
                dailyRecurrence: {
                    daysOfWeek: recurringSchedule.dailyRecurrence.daysOfWeek,
                    timeSlots: timeSlotDtos,
                    excludedTimeSlots: excludedTimeSlotDtos,
                },
                validity: {
                    startDate: recurringSchedule.validity.startDate.toISOString(),
                    endDate: recurringSchedule.validity.endDate?.toISOString(),
                },
                notes: recurringSchedule.notes,
            };
        }
        const exceptionDtos = availability.getExceptions().map((exception) => ({
            id: exception.id,
            type: exception.type,
            reason: exception.reason,
            startTime: exception.startTime.toISOString(),
            endTime: exception.endTime.toISOString(),
            createdAt: exception.createdAt?.toISOString(),
        }));
        return new DriverAvailabilityResponseDto_1.DriverAvailabilityResponseDto({
            id: availability.getId(),
            driverId: availability.getDriverId(),
            status: availability.getStatus(),
            currentLocation: {
                latitude: location.latitude,
                longitude: location.longitude,
                address: location.address,
            },
            recurringSchedule: recurringScheduleDto,
            exceptions: exceptionDtos,
            isActive: availability.getIsActive(),
            createdAt: availability.getCreatedAt().toISOString(),
            updatedAt: availability.getUpdatedAt().toISOString(),
        });
    }
};
exports.ScheduleRecurringAvailabilityUseCase = ScheduleRecurringAvailabilityUseCase;
exports.ScheduleRecurringAvailabilityUseCase = ScheduleRecurringAvailabilityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object])
], ScheduleRecurringAvailabilityUseCase);
//# sourceMappingURL=ScheduleRecurringAvailabilityUseCase.js.map