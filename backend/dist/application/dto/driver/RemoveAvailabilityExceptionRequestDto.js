"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAvailabilityExceptionRequestDto = void 0;
class RemoveAvailabilityExceptionRequestDto {
    constructor(userId, exceptionId) {
        this.userId = userId;
        this.exceptionId = exceptionId;
    }
    static fromRequest(userId, exceptionId) {
        return new RemoveAvailabilityExceptionRequestDto(userId, exceptionId);
    }
    getUserId() {
        return this.userId;
    }
    getExceptionId() {
        return this.exceptionId;
    }
    validate() {
        const errors = [];
        if (!this.exceptionId || this.exceptionId.trim().length === 0) {
            errors.push("Exception ID is required");
        }
        return errors;
    }
}
exports.RemoveAvailabilityExceptionRequestDto = RemoveAvailabilityExceptionRequestDto;
//# sourceMappingURL=RemoveAvailabilityExceptionRequestDto.js.map