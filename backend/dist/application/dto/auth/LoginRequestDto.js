"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestDto = void 0;
class LoginRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }
    static fromrequest(data) {
        return new LoginRequestDto(data);
    }
    getEmailValue() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
}
exports.LoginRequestDto = LoginRequestDto;
//# sourceMappingURL=LoginRequestDto.js.map