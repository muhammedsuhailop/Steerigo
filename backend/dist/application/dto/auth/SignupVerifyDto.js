"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupVerifyDto = void 0;
const Email_1 = require("@domain/value-objects/Email");
class SignupVerifyDto {
    constructor(data) {
        this.email = Email_1.Email.create(data.email);
        this.otp = data.otp;
    }
    static fromRequest(data) {
        return new SignupVerifyDto(data);
    }
    getEmail() {
        return this.email.getValue();
    }
    getOtp() {
        return this.otp;
    }
}
exports.SignupVerifyDto = SignupVerifyDto;
//# sourceMappingURL=SignupVerifyDto.js.map