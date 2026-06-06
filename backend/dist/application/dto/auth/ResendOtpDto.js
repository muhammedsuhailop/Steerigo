"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpDto = void 0;
const Email_1 = require("../../../domain/value-objects/Email");
class ResendOtpDto {
    constructor(data) {
        this.email = Email_1.Email.create(data.email);
    }
    static fromRequest(data) {
        return new ResendOtpDto(data);
    }
    getEmail() {
        return this.email.getValue();
    }
}
exports.ResendOtpDto = ResendOtpDto;
//# sourceMappingURL=ResendOtpDto.js.map