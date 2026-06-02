"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRideByIdSchema = exports.GetUserRideByIdDto = void 0;
const zod_1 = require("zod");
const getUserRideByIdSchema = zod_1.z.object({
    rideId: zod_1.z.string().min(1, "Ride ID is required"),
});
exports.getUserRideByIdSchema = getUserRideByIdSchema;
class GetUserRideByIdDto {
    constructor(userId, rideData) {
        this.userId = userId;
        this.data = getUserRideByIdSchema.parse(rideData);
    }
    static fromRequest(userId, rideData) {
        return new GetUserRideByIdDto(userId, rideData);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.data.rideId;
    }
}
exports.GetUserRideByIdDto = GetUserRideByIdDto;
//# sourceMappingURL=GetUserRideByIdDto.js.map