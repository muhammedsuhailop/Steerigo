"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkRideAsArrivedDto = void 0;
class MarkRideAsArrivedDto {
    constructor(userId, rideId) {
        this.userId = userId;
        this.rideId = rideId;
    }
    static fromRequest(userId, data) {
        if (!userId || userId.trim() === "") {
            throw new Error("User ID is required");
        }
        if (!data.rideId || data.rideId.trim() === "") {
            throw new Error("Ride ID is required");
        }
        return new MarkRideAsArrivedDto(userId, data.rideId);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.rideId;
    }
}
exports.MarkRideAsArrivedDto = MarkRideAsArrivedDto;
//# sourceMappingURL=MarkRideAsArrivedDto.js.map