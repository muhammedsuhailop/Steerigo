"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverProfileRequestDto = void 0;
class GetDriverProfileRequestDto {
    constructor(userId) {
        this.userId = userId;
    }
    getUserId() {
        return this.userId;
    }
    isValid() {
        return !!this.userId && this.userId.trim().length > 0;
    }
}
exports.GetDriverProfileRequestDto = GetDriverProfileRequestDto;
//# sourceMappingURL=GetDriverProfileRequestDto.js.map