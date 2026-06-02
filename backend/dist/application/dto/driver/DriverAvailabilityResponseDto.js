"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityResponseDto = exports.LocationDto = exports.AvailabilityExceptionDto = exports.RecurringScheduleDto = exports.ScheduleValidityDto = exports.DailyRecurrenceDto = exports.TimeSlotDto = void 0;
class TimeSlotDto {
    constructor(startTime, endTime, displayStartTime, displayEndTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.displayStartTime = displayStartTime;
        this.displayEndTime = displayEndTime;
    }
}
exports.TimeSlotDto = TimeSlotDto;
class DailyRecurrenceDto {
    constructor(daysOfWeek, timeSlots, excludedTimeSlots) {
        this.daysOfWeek = daysOfWeek;
        this.timeSlots = timeSlots;
        this.excludedTimeSlots = excludedTimeSlots;
    }
}
exports.DailyRecurrenceDto = DailyRecurrenceDto;
class ScheduleValidityDto {
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
exports.ScheduleValidityDto = ScheduleValidityDto;
class RecurringScheduleDto {
    constructor(dailyRecurrence, validity, notes) {
        this.dailyRecurrence = dailyRecurrence;
        this.validity = validity;
        this.notes = notes;
    }
}
exports.RecurringScheduleDto = RecurringScheduleDto;
class AvailabilityExceptionDto {
    constructor(params) {
        this.id = params.id;
        this.type = params.type;
        this.reason = params.reason;
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.isRecurring = params.isRecurring;
        this.recurringPattern = params.recurringPattern;
        this.createdAt = params.createdAt;
    }
}
exports.AvailabilityExceptionDto = AvailabilityExceptionDto;
class LocationDto {
    constructor(latitude, longitude, address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }
}
exports.LocationDto = LocationDto;
class DriverAvailabilityResponseDto {
    constructor(params) {
        this.id = params.id;
        this.driverId = params.driverId;
        this.status = params.status;
        this.currentLocation = params.currentLocation;
        this.recurringSchedule = params.recurringSchedule;
        this.exceptions = params.exceptions;
        this.isActive = params.isActive;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}
exports.DriverAvailabilityResponseDto = DriverAvailabilityResponseDto;
//# sourceMappingURL=DriverAvailabilityResponseDto.js.map