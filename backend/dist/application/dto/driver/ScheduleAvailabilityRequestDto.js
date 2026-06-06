"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAvailabilityRequestDto = void 0;
const zod_1 = require("zod");
const scheduleAvailabilitySchema = zod_1.z.object({
    availableFrom: zod_1.z
        .string()
        .datetime("Invalid datetime format for availableFrom"),
    availableTill: zod_1.z
        .string()
        .datetime("Invalid datetime format for availableTill"),
    currentLocation: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        address: zod_1.z.string().max(500).optional(),
    }),
});
class ScheduleAvailabilityRequestDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = scheduleAvailabilitySchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        return new ScheduleAvailabilityRequestDto(userId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getAvailableFrom() {
        return new Date(this.data.availableFrom);
    }
    getAvailableTill() {
        return new Date(this.data.availableTill);
    }
    getLocationData() {
        return this.data.currentLocation;
    }
    validate() {
        const errors = [];
        const now = new Date();
        const availableFrom = this.getAvailableFrom();
        const availableTill = this.getAvailableTill();
        if (availableFrom < now) {
            errors.push("Available from time cannot be in the past");
        }
        if (availableTill <= availableFrom) {
            errors.push("Available till time must be after available from time");
        }
        const maxDuration = 168 * 60 * 60 * 1000; // 7 days
        if (availableTill.getTime() - availableFrom.getTime() > maxDuration) {
            errors.push("Availability duration cannot exceed 7 days");
        }
        return errors;
    }
}
exports.ScheduleAvailabilityRequestDto = ScheduleAvailabilityRequestDto;
//# sourceMappingURL=ScheduleAvailabilityRequestDto.js.map