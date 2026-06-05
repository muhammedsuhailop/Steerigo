"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRecurringAvailabilityRequestDto = void 0;
const zod_1 = require("zod");
const TimeSlot_1 = require("../../../domain/value-objects/TimeSlot");
const timeSlotSchema = zod_1.z.object({
    startTime: zod_1.z.number().int().min(0).max(1440),
    endTime: zod_1.z.number().int().min(0).max(1440),
});
const scheduleRecurringAvailabilitySchema = zod_1.z.object({
    daysOfWeek: zod_1.z
        .array(zod_1.z.number().int().min(0).max(6))
        .min(1, "At least one day must be selected"),
    timeSlots: zod_1.z
        .array(timeSlotSchema)
        .min(1, "At least one time slot must be defined"),
    excludedTimeSlots: zod_1.z.array(timeSlotSchema).optional(),
    validityStartDate: zod_1.z.string().datetime("Invalid datetime format"),
    validityEndDate: zod_1.z.string().datetime("Invalid datetime format").optional(),
    notes: zod_1.z.string().max(1000).optional(),
    currentLocation: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        address: zod_1.z.string().max(500).optional(),
    }),
});
class ScheduleRecurringAvailabilityRequestDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = scheduleRecurringAvailabilitySchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        return new ScheduleRecurringAvailabilityRequestDto(userId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getDaysOfWeek() {
        return this.data.daysOfWeek;
    }
    getTimeSlots() {
        return this.data.timeSlots.map((slot) => TimeSlot_1.TimeSlot.create(slot.startTime, slot.endTime));
    }
    getExcludedTimeSlots() {
        return (this.data.excludedTimeSlots?.map((slot) => TimeSlot_1.TimeSlot.create(slot.startTime, slot.endTime)) || []);
    }
    getValidityStartDate() {
        return new Date(this.data.validityStartDate);
    }
    getValidityEndDate() {
        return this.data.validityEndDate
            ? new Date(this.data.validityEndDate)
            : null;
    }
    getNotes() {
        return this.data.notes;
    }
    getLocationData() {
        return this.data.currentLocation;
    }
    validate() {
        const errors = [];
        // Validate time slots
        const timeSlots = this.getTimeSlots();
        for (const slot of timeSlots) {
            if (slot.getStartTime() === slot.getEndTime()) {
                errors.push("Time slot start and end times cannot be the same");
            }
        }
        // Validate no overlapping time slots
        for (let i = 0; i < timeSlots.length; i++) {
            for (let j = i + 1; j < timeSlots.length; j++) {
                if (this.timeSlotsOverlap(timeSlots[i], timeSlots[j])) {
                    errors.push(`Time slot ${i + 1} and ${j + 1} overlap`);
                }
            }
        }
        return errors;
    }
    timeSlotsOverlap(slot1, slot2) {
        const s1Start = slot1.getStartTime();
        const s1End = slot1.getEndTime();
        const s2Start = slot2.getStartTime();
        const s2End = slot2.getEndTime();
        if (s1Start <= s1End && s2Start <= s2End) {
            return !(s1End <= s2Start || s2End <= s1Start);
        }
        return false;
    }
}
exports.ScheduleRecurringAvailabilityRequestDto = ScheduleRecurringAvailabilityRequestDto;
//# sourceMappingURL=ScheduleRecurringAvailabilityRequestDto.js.map