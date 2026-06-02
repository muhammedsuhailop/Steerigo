"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailability = void 0;
const AvailabilityStatus_1 = require("../value-objects/AvailabilityStatus");
const AvailabilityException_1 = require("./AvailabilityException");
const Logger_1 = require("@shared/utils/Logger");
class DriverAvailability {
    constructor(id, driverId, status, currentLocation, baseLocation, recurringSchedule, exceptions = [], isActive = true, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.driverId = driverId;
        this.status = status;
        this.currentLocation = currentLocation;
        this.baseLocation = baseLocation;
        this.recurringSchedule = recurringSchedule;
        this.exceptions = exceptions;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static createRecurring(id, driverId, dailyRecurrence, validity, currentLocation, baseLocation, notes) {
        this.validateRecurringSchedule(dailyRecurrence, validity);
        return new DriverAvailability(id, driverId, AvailabilityStatus_1.AvailabilityStatus.SCHEDULED, currentLocation, baseLocation, {
            dailyRecurrence,
            validity,
            notes,
        }, [], true);
    }
    static createImmediate(id, driverId, currentLocation, baseLocation) {
        return new DriverAvailability(id, driverId, AvailabilityStatus_1.AvailabilityStatus.AVAILABLE, currentLocation, baseLocation, undefined, [], true);
    }
    static fromData(data) {
        return new DriverAvailability(data.id, data.driverId, data.status, data.currentLocation, data.baseLocation, data.recurringSchedule, data.exceptions || [], data.isActive, data.createdAt, data.updatedAt);
    }
    static validateRecurringSchedule(dailyRecurrence, validity) {
        if (!dailyRecurrence.daysOfWeek ||
            dailyRecurrence.daysOfWeek.length === 0) {
            throw new Error("At least one day of week must be selected");
        }
        if (!dailyRecurrence.timeSlots || dailyRecurrence.timeSlots.length === 0) {
            throw new Error("At least one time slot must be defined");
        }
        if (validity.endDate && validity.startDate >= validity.endDate) {
            throw new Error("Schedule validity end date must be after start date");
        }
    }
    getId() {
        return this.id;
    }
    getDriverId() {
        return this.driverId;
    }
    getStatus() {
        return this.status;
    }
    getCurrentLocation() {
        return this.currentLocation;
    }
    getBaseLocation() {
        return this.baseLocation;
    }
    getRecurringSchedule() {
        return this.recurringSchedule;
    }
    getExceptions() {
        return [...this.exceptions];
    }
    getIsActive() {
        return this.isActive;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    schedule() {
        if (this.status === AvailabilityStatus_1.AvailabilityStatus.SCHEDULED && this.isActive) {
            return;
        }
        if (!this.canTransitionTo(AvailabilityStatus_1.AvailabilityStatus.SCHEDULED)) {
            throw new Error(`Cannot transition from ${this.status} to SCHEDULED`);
        }
        this.status = AvailabilityStatus_1.AvailabilityStatus.SCHEDULED;
        this.isActive = true;
        this.updatedAt = new Date();
    }
    updateStatus(newStatus) {
        if (this.status === newStatus) {
            throw new Error(`Driver is already ${newStatus}`);
        }
        if (!this.canTransitionTo(newStatus)) {
            throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
        }
        this.status = newStatus;
        this.updatedAt = new Date();
    }
    updateLocation(newLocation) {
        this.currentLocation = newLocation;
        this.updatedAt = new Date();
    }
    updateBaseLocation(newLocation) {
        this.baseLocation = newLocation;
        this.updatedAt = new Date();
    }
    updateRecurringSchedule(dailyRecurrence, validity, notes) {
        DriverAvailability.validateRecurringSchedule(dailyRecurrence, validity);
        this.recurringSchedule = {
            dailyRecurrence,
            validity,
            notes,
        };
        this.updatedAt = new Date();
    }
    clearRecurringSchedule() {
        this.recurringSchedule = undefined;
        this.updatedAt = new Date();
    }
    addException(exception) {
        AvailabilityException_1.AvailabilityExceptionValidator.validate(exception);
        this.exceptions.push(exception);
        this.updatedAt = new Date();
    }
    removeException(exceptionId) {
        const initialLength = this.exceptions.length;
        this.exceptions = this.exceptions.filter((e) => e.id !== exceptionId);
        if (this.exceptions.length < initialLength) {
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }
    updateException(exceptionId, updates) {
        const exception = this.exceptions.find((e) => e.id === exceptionId);
        if (!exception) {
            return false;
        }
        const updatedException = { ...exception, ...updates };
        AvailabilityException_1.AvailabilityExceptionValidator.validate(updatedException);
        Object.assign(exception, updates);
        this.updatedAt = new Date();
        return true;
    }
    activate() {
        this.isActive = true;
        if (this.status === AvailabilityStatus_1.AvailabilityStatus.OFFLINE) {
            this.status = AvailabilityStatus_1.AvailabilityStatus.AVAILABLE;
        }
        this.updatedAt = new Date();
    }
    deactivate() {
        this.isActive = false;
        this.status = AvailabilityStatus_1.AvailabilityStatus.OFFLINE;
        this.updatedAt = new Date();
    }
    isAvailableAt(checkDate) {
        if (!this.isActive) {
            return false;
        }
        if (this.hasDateBasedException(checkDate)) {
            return false;
        }
        if (this.recurringSchedule) {
            return this.isWithinRecurringSchedule(checkDate);
        }
        return this.status === AvailabilityStatus_1.AvailabilityStatus.AVAILABLE;
    }
    isAvailableForTimeRange(startTime, endTime) {
        if (startTime >= endTime) {
            throw new Error("Start time must be before end time");
        }
        if (!this.isActive) {
            Logger_1.Logger.debug("Availability Trace: Driver is not active", {
                driverId: this.driverId,
            });
            return false;
        }
        for (const exception of this.exceptions) {
            if (exception.startTime < endTime && exception.endTime > startTime) {
                Logger_1.Logger.debug("Availability Trace: Overlap with manual exception", {
                    driverId: this.driverId,
                    exception,
                });
                return false;
            }
        }
        if (this.recurringSchedule) {
            return this.isRangeWithinRecurringSchedule(startTime, endTime);
        }
        const isAvailable = this.status === AvailabilityStatus_1.AvailabilityStatus.AVAILABLE;
        if (!isAvailable) {
            Logger_1.Logger.debug("Availability Trace: Missing recurring schedule and status not AVAILABLE", { driverId: this.driverId, status: this.status });
        }
        return isAvailable;
    }
    isRangeWithinRecurringSchedule(startTime, endTime) {
        const { dailyRecurrence, validity } = this.recurringSchedule;
        if (startTime < validity.startDate) {
            Logger_1.Logger.debug("Availability Trace: Request is before schedule validity start date", { driverId: this.driverId, validityStart: validity.startDate });
            return false;
        }
        if (validity.endDate && endTime > validity.endDate) {
            Logger_1.Logger.debug("Availability Trace: Request is after schedule validity end date", { driverId: this.driverId, validityEnd: validity.endDate });
            return false;
        }
        const currentDate = new Date(startTime);
        currentDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(endTime);
        endDate.setUTCHours(23, 59, 59, 999);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getUTCDay();
            if (dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
                let dayRangeStart = new Date(currentDate);
                let dayRangeEnd = new Date(currentDate);
                dayRangeEnd.setUTCHours(23, 59, 59, 999);
                if (startTime > dayRangeStart) {
                    dayRangeStart = new Date(startTime);
                }
                if (endTime < dayRangeEnd) {
                    dayRangeEnd = new Date(endTime);
                }
                if (!this.isDayRangeCoveredBySlots(dayRangeStart, dayRangeEnd, dailyRecurrence)) {
                    Logger_1.Logger.debug("Availability Trace: Time slot coverage failed for day", { driverId: this.driverId, dayOfWeek, dayRangeStart, dayRangeEnd });
                    return false;
                }
            }
            else {
                const dayStart = new Date(currentDate);
                const dayEnd = new Date(currentDate);
                dayEnd.setUTCHours(23, 59, 59, 999);
                if (startTime < dayEnd && endTime > dayStart) {
                    Logger_1.Logger.debug("Availability Trace: Day of week not in driver's recurrence", {
                        driverId: this.driverId,
                        dayOfWeek,
                        allowedDays: dailyRecurrence.daysOfWeek,
                    });
                    return false;
                }
            }
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            currentDate.setUTCHours(0, 0, 0, 0);
        }
        return true;
    }
    isDayRangeCoveredBySlots(dayRangeStart, dayRangeEnd, dailyRecurrence) {
        const startMinutes = dayRangeStart.getUTCHours() * 60 + dayRangeStart.getUTCMinutes();
        const endMinutes = dayRangeEnd.getUTCHours() * 60 + dayRangeEnd.getUTCMinutes();
        const queryRanges = this.normalizeRange(startMinutes, endMinutes);
        for (const [qStart, qEnd] of queryRanges) {
            let covered = false;
            for (const slot of dailyRecurrence.timeSlots) {
                const slotRanges = this.normalizeRange(slot.getStartTime(), slot.getEndTime());
                if (slotRanges.some(([sStart, sEnd]) => qStart >= sStart && qEnd <= sEnd)) {
                    covered = true;
                    break;
                }
            }
            if (!covered) {
                Logger_1.Logger.debug("Availability Trace: Minutes range not covered by any time slot", {
                    driverId: this.driverId,
                    requestedMinutes: { qStart, qEnd },
                    availableSlots: dailyRecurrence.timeSlots.map((s) => ({
                        start: s.getStartTime(),
                        end: s.getEndTime(),
                    })),
                });
                return false;
            }
        }
        if (dailyRecurrence.excludedTimeSlots?.length) {
            for (const ex of dailyRecurrence.excludedTimeSlots) {
                const exRanges = this.normalizeRange(ex.getStartTime(), ex.getEndTime());
                for (const [qStart, qEnd] of queryRanges) {
                    if (exRanges.some(([eStart, eEnd]) => qStart < eEnd && eStart < qEnd)) {
                        Logger_1.Logger.debug("Availability Trace: Hit an excluded time slot", {
                            driverId: this.driverId,
                            excludedSlot: ex,
                        });
                        return false;
                    }
                }
            }
        }
        return true;
    }
    isWithinRecurringSchedule(checkDate) {
        if (!this.recurringSchedule) {
            return false;
        }
        const { dailyRecurrence, validity } = this.recurringSchedule;
        if (checkDate < validity.startDate) {
            return false;
        }
        if (validity.endDate && checkDate > validity.endDate) {
            return false;
        }
        const dayOfWeek = checkDate.getUTCDay();
        if (!dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
            return false;
        }
        return this.isWithinTimeSlots(checkDate, dailyRecurrence);
    }
    isWithinTimeSlots(checkDate, dailyRecurrence) {
        const hours = checkDate.getUTCHours();
        const minutes = checkDate.getUTCMinutes();
        const timeInMinutes = hours * 60 + minutes;
        const inTimeSlot = dailyRecurrence.timeSlots.some((slot) => slot.containsTime(timeInMinutes));
        if (!inTimeSlot) {
            return false;
        }
        if (dailyRecurrence.excludedTimeSlots) {
            const inExcludedSlot = dailyRecurrence.excludedTimeSlots.some((slot) => slot.containsTime(timeInMinutes));
            if (inExcludedSlot) {
                return false;
            }
        }
        return true;
    }
    hasDateBasedException(checkDate) {
        return this.exceptions.some((exception) => {
            return checkDate >= exception.startTime && checkDate <= exception.endTime;
        });
    }
    canTransitionTo(newStatus) {
        const allowedTransitions = {
            [AvailabilityStatus_1.AvailabilityStatus.OFFLINE]: [
                AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
                AvailabilityStatus_1.AvailabilityStatus.SCHEDULED,
            ],
            [AvailabilityStatus_1.AvailabilityStatus.AVAILABLE]: [
                AvailabilityStatus_1.AvailabilityStatus.BUSY,
                AvailabilityStatus_1.AvailabilityStatus.OFFLINE,
                AvailabilityStatus_1.AvailabilityStatus.SCHEDULED,
            ],
            [AvailabilityStatus_1.AvailabilityStatus.BUSY]: [
                AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
                AvailabilityStatus_1.AvailabilityStatus.OFFLINE,
                AvailabilityStatus_1.AvailabilityStatus.SCHEDULED,
            ],
            [AvailabilityStatus_1.AvailabilityStatus.SCHEDULED]: [
                AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
                AvailabilityStatus_1.AvailabilityStatus.BUSY,
                AvailabilityStatus_1.AvailabilityStatus.OFFLINE,
            ],
        };
        return allowedTransitions[this.status].includes(newStatus);
    }
    normalizeRange(start, end) {
        if (start <= end) {
            return [[start, end]];
        }
        return [
            [start, 1440],
            [0, end],
        ];
    }
}
exports.DriverAvailability = DriverAvailability;
//# sourceMappingURL=DriverAvailability.js.map