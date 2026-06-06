"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginRequestDto = void 0;
class GoogleLoginRequestDto {
    constructor(data) {
        this.code = data.code;
    }
    getCode() {
        return this.code;
    }
}
exports.GoogleLoginRequestDto = GoogleLoginRequestDto;
//# sourceMappingURL=GoogleLoginRequestDto.js.map