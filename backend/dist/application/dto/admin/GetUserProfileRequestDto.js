"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfileRequestDto = void 0;
class GetUserProfileRequestDto {
    constructor(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new Error("User ID is required");
        }
        this.userId = userId.trim();
    }
    getUserId() {
        return this.userId;
    }
}
exports.GetUserProfileRequestDto = GetUserProfileRequestDto;
//# sourceMappingURL=GetUserProfileRequestDto.js.map