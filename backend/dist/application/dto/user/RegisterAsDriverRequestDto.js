"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAsDriverRequestDto = void 0;
class RegisterAsDriverRequestDto {
    constructor(userId) {
        this.userId = userId;
    }
    static fromRequest(userId) {
        return new RegisterAsDriverRequestDto(userId);
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
exports.RegisterAsDriverRequestDto = RegisterAsDriverRequestDto;
//# sourceMappingURL=RegisterAsDriverRequestDto.js.map