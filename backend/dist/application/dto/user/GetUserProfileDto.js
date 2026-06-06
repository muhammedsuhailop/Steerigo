"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfileDto = void 0;
class GetUserProfileDto {
    constructor(userId) {
        this.userId = userId;
    }
    static fromRequest(userId) {
        return new GetUserProfileDto(userId);
    }
    validate() {
        const errors = [];
        if (!this.userId) {
            errors.push("User ID is required");
        }
        if (this.userId && typeof this.userId !== "string") {
            errors.push("User ID must be a string");
        }
        return errors;
    }
}
exports.GetUserProfileDto = GetUserProfileDto;
//# sourceMappingURL=GetUserProfileDto.js.map