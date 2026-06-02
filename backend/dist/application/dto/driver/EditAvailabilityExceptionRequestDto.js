"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAvailabilityExceptionSchema = exports.EditAvailabilityExceptionRequestDto = void 0;
const AvailabilityExceptionType_1 = require("@domain/value-objects/AvailabilityExceptionType");
const zod_1 = require("zod");
const editAvailabilityExceptionSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(AvailabilityExceptionType_1.AvailabilityExceptionType).optional(),
    reason: zod_1.z.string().max(500).optional(),
    startTime: zod_1.z.string().datetime("Invalid datetime format").optional(),
    endTime: zod_1.z.string().datetime("Invalid datetime format").optional(),
});
exports.editAvailabilityExceptionSchema = editAvailabilityExceptionSchema;
class EditAvailabilityExceptionRequestDto {
    constructor(userId, exceptionId, requestData) {
        this.userId = userId;
        this.exceptionId = exceptionId;
        this.data = editAvailabilityExceptionSchema.parse(requestData);
    }
    static fromRequest(userId, exceptionId, requestBody) {
        return new EditAvailabilityExceptionRequestDto(userId, exceptionId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getExceptionId() {
        return this.exceptionId;
    }
    getType() {
        return this.data.type;
    }
    getReason() {
        return this.data.reason;
    }
    getStartTime() {
        return this.data.startTime ? new Date(this.data.startTime) : undefined;
    }
    getEndTime() {
        return this.data.endTime ? new Date(this.data.endTime) : undefined;
    }
    hasChanges() {
        return Object.values(this.data).some((value) => value !== undefined);
    }
    validate() {
        const errors = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = this.getStartTime();
        const end = this.getEndTime();
        if (start && start < today) {
            errors.push("Start time must be today or a future date");
        }
        if (end && end < today) {
            errors.push("End time must be today or a future date");
        }
        if (start && end) {
            if (end.getTime() <= start.getTime()) {
                errors.push("End time must be after start time");
            }
        }
        if (start && end) {
            const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            if (diffMinutes < 30) {
                errors.push("Time difference must be at least 30 minutes");
            }
        }
        return errors;
    }
}
exports.EditAvailabilityExceptionRequestDto = EditAvailabilityExceptionRequestDto;
//# sourceMappingURL=EditAvailabilityExceptionRequestDto.js.map