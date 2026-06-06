"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverDashboardDto = void 0;
class GetDriverDashboardDto {
    constructor(userId) {
        if (!userId || userId.trim() === "") {
            throw new Error("User ID is required");
        }
        this.userId = userId;
    }
    static fromRequest(userId) {
        return new GetDriverDashboardDto(userId);
    }
    getUserId() {
        return this.userId;
    }
}
exports.GetDriverDashboardDto = GetDriverDashboardDto;
//# sourceMappingURL=GetDriverDashboardDto.js.map