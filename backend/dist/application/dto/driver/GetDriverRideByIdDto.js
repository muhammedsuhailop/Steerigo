"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverRideByIdSchema = exports.GetDriverRideByIdDto = void 0;
const zod_1 = require("zod");
const getDriverRideByIdSchema = zod_1.z.object({
    rideId: zod_1.z.string().min(1, "Ride ID is required"),
});
exports.getDriverRideByIdSchema = getDriverRideByIdSchema;
class GetDriverRideByIdDto {
    constructor(userId, rideData) {
        this.userId = userId;
        this.data = getDriverRideByIdSchema.parse(rideData);
    }
    static fromRequest(userId, rideData) {
        return new GetDriverRideByIdDto(userId, rideData);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.data.rideId;
    }
}
exports.GetDriverRideByIdDto = GetDriverRideByIdDto;
//# sourceMappingURL=GetDriverRideByIdDto.js.map