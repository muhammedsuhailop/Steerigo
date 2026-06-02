"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordDto = void 0;
class UpdatePasswordDto {
    constructor(userId, body) {
        this.userId = userId;
        this.currentPassword = body.currentPassword;
        this.newPassword = body.newPassword;
    }
    static fromRequest(userId, body) {
        return new UpdatePasswordDto(userId, body);
    }
    getUserId() {
        return this.userId;
    }
    getCurrentPassword() {
        return this.currentPassword;
    }
    getNewPassword() {
        return this.newPassword;
    }
}
exports.UpdatePasswordDto = UpdatePasswordDto;
//# sourceMappingURL=UpdatePasswordDto.js.map