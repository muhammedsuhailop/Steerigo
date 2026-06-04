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
exports.AvailabilityCheckService = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
let AvailabilityCheckService = class AvailabilityCheckService {
    constructor(availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }
    async isAvailableDuring(driverId, startDate, endDate) {
        const availability = await this.availabilityRepository.findActiveByDriverId(driverId);
        if (!availability)
            return false;
        const durationMinutes = (endDate.getTime() - startDate.getTime()) / 60000;
        return this.isDriverAvailableForDuration(availability, startDate, durationMinutes);
    }
    isDriverAvailableForDuration(availability, searchDate, timeRequiredMinutes) {
        const schedule = availability.getRecurringSchedule();
        if (!schedule)
            return false;
        const rideEnd = new Date(searchDate);
        rideEnd.setMinutes(rideEnd.getMinutes() + timeRequiredMinutes);
        const exceptions = availability.getExceptions?.() ?? [];
        for (const exception of exceptions) {
            const exceptionStart = new Date(exception.startTime);
            const exceptionEnd = new Date(exception.endTime);
            if (searchDate < exceptionEnd && rideEnd > exceptionStart) {
                return false;
            }
        }
        const validFrom = new Date(schedule.validity.startDate);
        const validTill = new Date(schedule.validity.endDate ?? new Date(9999, 11, 31));
        if (searchDate < validFrom || rideEnd > validTill) {
            return false;
        }
        const daily = schedule.dailyRecurrence;
        if (!daily)
            return false;
        const jsDay = searchDate.getUTCDay();
        const normalizedDay = jsDay === 0 ? 7 : jsDay;
        if (!daily.daysOfWeek.includes(normalizedDay)) {
            return false;
        }
        const startMinutes = searchDate.getUTCHours() * 60 + searchDate.getUTCMinutes();
        const endMinutes = startMinutes + timeRequiredMinutes;
        const fitsInSlot = daily.timeSlots.some((slot) => startMinutes >= slot.getStartTime() && endMinutes <= slot.getEndTime());
        if (!fitsInSlot)
            return false;
        if (daily.excludedTimeSlots?.length) {
            const overlapsExcluded = daily.excludedTimeSlots.some((slot) => startMinutes < slot.getEndTime() && endMinutes > slot.getStartTime());
            if (overlapsExcluded)
                return false;
        }
        return true;
    }
};
exports.AvailabilityCheckService = AvailabilityCheckService;
exports.AvailabilityCheckService = AvailabilityCheckService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __metadata("design:paramtypes", [Object])
], AvailabilityCheckService);
//# sourceMappingURL=AvailabilityCheckService.js.map