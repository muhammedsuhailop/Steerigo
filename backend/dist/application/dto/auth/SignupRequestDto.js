"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupRequestDto = void 0;
const Email_1 = require("@domain/value-objects/Email");
class SignupRequestDto {
    constructor(data) {
        this.email = Email_1.Email.create(data.email);
        this.name = data.name;
        this.password = data.password;
        this.mobile = data.mobile;
        this.role = data.role;
    }
    static fromRequest(data) {
        return new SignupRequestDto(data);
    }
    getEmailValue() {
        return this.email.getValue();
    }
    getName() {
        return this.name;
    }
    getPassword() {
        return this.password;
    }
    getMobile() {
        return this.mobile;
    }
    getRole() {
        return this.role;
    }
}
exports.SignupRequestDto = SignupRequestDto;
//# sourceMappingURL=SignupRequestDto.js.map