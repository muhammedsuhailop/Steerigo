"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordRequestDto = void 0;
const Email_1 = require("@domain/value-objects/Email");
class ForgotPasswordRequestDto {
    constructor(data) {
        this.email = Email_1.Email.create(data.email);
    }
    static fromRequest(data) {
        return new ForgotPasswordRequestDto(data);
    }
    getEmail() {
        return this.email.getValue();
    }
}
exports.ForgotPasswordRequestDto = ForgotPasswordRequestDto;
//# sourceMappingURL=ForgotPasswordRequestDto.js.map