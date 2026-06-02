"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordVerifyDto = void 0;
const Email_1 = require("@domain/value-objects/Email");
class ForgotPasswordVerifyDto {
    constructor(data) {
        this.email = Email_1.Email.create(data.email);
        this.otp = data.otp;
        this.newPassword = data.newPassword;
    }
    static fromRequest(data) {
        return new ForgotPasswordVerifyDto(data);
    }
    getEmail() {
        return this.email.getValue();
    }
    getOtp() {
        return this.otp;
    }
    getNewPassword() {
        return this.newPassword;
    }
}
exports.ForgotPasswordVerifyDto = ForgotPasswordVerifyDto;
//# sourceMappingURL=ForgotPasswordVerifyDto.js.map