"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkRideAsStartedDto = void 0;
class MarkRideAsStartedDto {
    constructor(userId, rideId, verificationCode) {
        this.userId = userId;
        this.rideId = rideId;
        this.verificationCode = verificationCode;
    }
    static fromRequest(userId, data) {
        if (!userId || userId.trim() === "") {
            throw new Error("User ID is required");
        }
        if (!data.rideId || data.rideId.trim() === "") {
            throw new Error("Ride ID is required");
        }
        if (!data.verificationCode || !/^\d{4}$/.test(data.verificationCode)) {
            throw new Error("Verification code must be a valid 4-digit code");
        }
        return new MarkRideAsStartedDto(userId, data.rideId, data.verificationCode);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.rideId;
    }
    getVerificationCode() {
        return this.verificationCode;
    }
}
exports.MarkRideAsStartedDto = MarkRideAsStartedDto;
//# sourceMappingURL=MarkRideAsStartedDto.js.map