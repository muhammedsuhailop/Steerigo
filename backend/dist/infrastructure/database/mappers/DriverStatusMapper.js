"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverStatusMapper = void 0;
const AvailabilityStatus_1 = require("@domain/value-objects/AvailabilityStatus");
const TimeSlotHelper_1 = require("@shared/utils/TimeSlotHelper");
const ScheduleValidityHelper_1 = require("@shared/utils/ScheduleValidityHelper");
class DriverStatusMapper {
    static toDtoFromEntity(availability) {
        const recurringSchedule = this.mapRecurringSchedule(availability.getRecurringSchedule()) ?? null;
        return {
            id: availability.getId(),
            driverId: availability.getDriverId(),
            availabilityStatus: availability.getStatus(),
            currentLocation: this.mapLocation(availability.getCurrentLocation()),
            baseLocation: this.mapLocation(availability.getBaseLocation()),
            lastLocationUpdateAt: new Date(),
            recurringSchedule,
            exceptions: availability
                .getExceptions()
                .map((exc) => this.mapException(exc)),
            activeExceptionsCount: availability
                .getExceptions()
                .filter((exc) => this.isExceptionActive(exc)).length,
            summary: this.buildSummary(availability.getStatus(), availability.getExceptions(), availability.getRecurringSchedule()),
            todayTimeSlots: this.calculateTodayTimeSlots(availability.getExceptions(), availability.getRecurringSchedule()),
            isActive: availability.getIsActive(),
            createdAt: availability.getCreatedAt(),
            updatedAt: availability.getUpdatedAt(),
        };
    }
    static mapLocation(domainLocation) {
        const coordinates = domainLocation.getCoordinates();
        return {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            address: coordinates.address,
            lastUpdatedAt: new Date(),
            accuracy: 10,
        };
    }
    static mapRecurringSchedule(domainSchedule) {
        if (!domainSchedule)
            return undefined;
        const { dailyRecurrence, validity } = domainSchedule;
        const timeSlots = dailyRecurrence.timeSlots.map((slot) => TimeSlotHelper_1.TimeSlotHelper.minutesToTimeSlot(slot.getStartTime(), slot.getEndTime()));
        const excludedTimeSlots = (dailyRecurrence.excludedTimeSlots ?? []).map((slot) => TimeSlotHelper_1.TimeSlotHelper.minutesToTimeSlot(slot.getStartTime(), slot.getEndTime()));
        const daysOfWeek = dailyRecurrence.daysOfWeek;
        const daysOfWeekLabels = TimeSlotHelper_1.TimeSlotHelper.getDayLabels(daysOfWeek);
        const isCurrentlyValid = ScheduleValidityHelper_1.ScheduleValidityHelper.isValidityActive(validity, new Date());
        return {
            dailyRecurrence: {
                daysOfWeek,
                timeSlots,
                excludedTimeSlots,
                daysOfWeekLabels,
            },
            validity: {
                startDate: validity.startDate,
                endDate: validity.endDate ?? null,
                isCurrentlyValid,
            },
            notes: domainSchedule.notes,
            isActive: isCurrentlyValid,
        };
    }
    static mapException(domainException) {
        const startTime = domainException.startTime;
        const endTime = domainException.endTime;
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = Math.round((durationMs / 36e5) * 10) / 10;
        return {
            id: domainException.id,
            type: domainException.type,
            reason: domainException.reason,
            startTime,
            endTime,
            durationHours,
            createdAt: domainException.createdAt,
        };
    }
    static isExceptionActive(exception) {
        const now = new Date();
        return now >= exception.startTime && now <= exception.endTime;
    }
    static buildSummary(availabilityStatus, exceptions, domainSchedule) {
        const now = new Date();
        const recurringSchedule = this.mapRecurringSchedule(domainSchedule);
        const mappedExceptions = exceptions.map((exc) => this.mapException(exc));
        const todayTimeSlots = this.calculateTodayTimeSlots(exceptions, domainSchedule);
        return {
            isCurrentlyAvailable: availabilityStatus === AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
            nextAvailableTime: this.findNextAvailableTime(todayTimeSlots, now),
            nextUnavailableTime: this.findNextUnavailableTime(mappedExceptions),
            totalHoursAvailableToday: todayTimeSlots.reduce((sum, slot) => sum + slot.durationMinutes / 60, 0),
            activeExceptionsCount: mappedExceptions.filter((exc) => exc).length,
            scheduleStatus: this.determineScheduleStatus(recurringSchedule, now),
        };
    }
    static calculateTodayTimeSlots(exceptions, domainSchedule) {
        const recurringSchedule = this.mapRecurringSchedule(domainSchedule);
        if (!recurringSchedule?.isActive)
            return [];
        const dayOfWeek = ScheduleValidityHelper_1.ScheduleValidityHelper.getTodayDayOfWeek();
        if (!recurringSchedule.dailyRecurrence.daysOfWeek.includes(dayOfWeek)) {
            return [];
        }
        let slots = [...recurringSchedule.dailyRecurrence.timeSlots];
        slots = slots.filter((slot) => !recurringSchedule.dailyRecurrence.excludedTimeSlots.some((excluded) => excluded.startTime === slot.startTime &&
            excluded.endTime === slot.endTime));
        const mappedExceptions = exceptions.map((exc) => this.mapException(exc));
        return slots.filter((slot) => !mappedExceptions.some((exc) => exc &&
            TimeSlotHelper_1.TimeSlotHelper.hasTimeOverlap(exc.startTime, exc.endTime, slot.startTime, slot.endTime)));
    }
    static findNextAvailableTime(todayTimeSlots, now) {
        if (todayTimeSlots.length === 0)
            return null;
        const [hours, mins] = todayTimeSlots[0].startTime.split(":").map(Number);
        const next = new Date();
        next.setHours(hours, mins, 0, 0);
        return next < now ? null : next;
    }
    static findNextUnavailableTime(exceptions) {
        const active = exceptions.find((exc) => exc);
        return active?.startTime ?? null;
    }
    static determineScheduleStatus(recurringSchedule, now) {
        if (!recurringSchedule)
            return AvailabilityStatus_1.AvailabilityStatus.OFFLINE;
        if (recurringSchedule.isActive) {
            return AvailabilityStatus_1.AvailabilityStatus.SCHEDULED;
        }
        if (ScheduleValidityHelper_1.ScheduleValidityHelper.isSchedulePending(recurringSchedule.validity.startDate, now)) {
            return AvailabilityStatus_1.AvailabilityStatus.SCHEDULED;
        }
        return AvailabilityStatus_1.AvailabilityStatus.OFFLINE;
    }
}
exports.DriverStatusMapper = DriverStatusMapper;
//# sourceMappingURL=DriverStatusMapper.js.map