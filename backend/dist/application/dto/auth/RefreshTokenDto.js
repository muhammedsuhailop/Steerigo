"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDto = void 0;
class RefreshTokenDto {
    constructor(data) {
        this.refreshToken = data.refreshToken;
    }
    static fromRequest(data) {
        return new RefreshTokenDto(data);
    }
}
exports.RefreshTokenDto = RefreshTokenDto;
//# sourceMappingURL=RefreshTokenDto.js.map