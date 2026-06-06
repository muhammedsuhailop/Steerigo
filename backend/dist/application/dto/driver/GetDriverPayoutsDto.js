"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverPayoutsDto = void 0;
class GetDriverPayoutsDto {
    constructor(userId) {
        this.userId = userId;
    }
    static create(userId) {
        return new GetDriverPayoutsDto(userId);
    }
    getUserId() {
        return this.userId;
    }
}
exports.GetDriverPayoutsDto = GetDriverPayoutsDto;
//# sourceMappingURL=GetDriverPayoutsDto.js.map