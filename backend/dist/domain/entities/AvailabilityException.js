"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityExceptionValidator = void 0;
const AvailabilityExceptionType_1 = require("../value-objects/AvailabilityExceptionType");
class AvailabilityExceptionValidator {
    static validate(exception) {
        if (!exception.id || exception.id.trim().length === 0) {
            throw new Error("Exception ID cannot be empty");
        }
        if (!Object.values(AvailabilityExceptionType_1.AvailabilityExceptionType).includes(exception.type)) {
            throw new Error(`Invalid exception type: ${exception.type}`);
        }
        if (exception.startTime >= exception.endTime) {
            throw new Error("Exception startTime must be less than endTime");
        }
        const durationMs = exception.endTime.getTime() - exception.startTime.getTime();
        const minDurationMs = 1 * 60 * 1000; // Minimum 1 minute
        if (durationMs < minDurationMs) {
            throw new Error("Exception duration must be at least 1 minute");
        }
    }
}
exports.AvailabilityExceptionValidator = AvailabilityExceptionValidator;
//# sourceMappingURL=AvailabilityException.js.map