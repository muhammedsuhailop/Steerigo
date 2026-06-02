"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAvailabilityExceptionSchema = exports.AddAvailabilityExceptionRequestDto = void 0;
const AvailabilityExceptionType_1 = require("../../../domain/value-objects/AvailabilityExceptionType");
const zod_1 = require("zod");
const addAvailabilityExceptionSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(AvailabilityExceptionType_1.AvailabilityExceptionType),
    reason: zod_1.z.string().max(500).optional(),
    startTime: zod_1.z.string().datetime("Invalid datetime format"),
    endTime: zod_1.z.string().datetime("Invalid datetime format"),
});
exports.addAvailabilityExceptionSchema = addAvailabilityExceptionSchema;
class AddAvailabilityExceptionRequestDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = addAvailabilityExceptionSchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        return new AddAvailabilityExceptionRequestDto(userId, requestBody);
    }
    getUserId() {
        return this.userId;
    }
    getType() {
        return this.data.type;
    }
    getReason() {
        return this.data.reason;
    }
    getStartTime() {
        return new Date(this.data.startTime);
    }
    getEndTime() {
        return new Date(this.data.endTime);
    }
    validate() {
        const errors = [];
        const start = this.getStartTime();
        const end = this.getEndTime();
        if (end.getTime() - start.getTime() <= 0) {
            errors.push("Exception duration must be positive");
        }
        return errors;
    }
}
exports.AddAvailabilityExceptionRequestDto = AddAvailabilityExceptionRequestDto;
//# sourceMappingURL=AddAvailabilityExceptionRequestDto.js.map