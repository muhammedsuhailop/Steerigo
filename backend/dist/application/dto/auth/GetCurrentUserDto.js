"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentUserDto = void 0;
class GetCurrentUserDto {
    constructor(data) {
        this.userId = data.userId;
    }
    static fromRequest(data) {
        return new GetCurrentUserDto(data);
    }
    getUserId() {
        return this.userId;
    }
}
exports.GetCurrentUserDto = GetCurrentUserDto;
//# sourceMappingURL=GetCurrentUserDto.js.map