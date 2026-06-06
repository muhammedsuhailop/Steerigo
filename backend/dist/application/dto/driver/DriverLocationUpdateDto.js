"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverLocationUpdateSchema = exports.DriverLocationUpdateDto = void 0;
const zod_1 = require("zod");
const driverLocationUpdateSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    bearing: zod_1.z.number().min(0).max(360).optional(),
    speedKph: zod_1.z.number().min(0).max(300).optional(),
    accuracy: zod_1.z.number().min(0).max(2000).optional(),
    rideId: zod_1.z.string().min(1).optional(),
    updatedAt: zod_1.z.number().optional(),
});
exports.driverLocationUpdateSchema = driverLocationUpdateSchema;
class DriverLocationUpdateDto {
    constructor(driverUserId, payload) {
        this.driverUserId = driverUserId;
        this.data = driverLocationUpdateSchema.parse(payload);
    }
    static fromSocket(driverUserId, payload) {
        return new DriverLocationUpdateDto(driverUserId, payload);
    }
    getDriverUserId() {
        return this.driverUserId;
    }
    getLatitude() {
        return this.data.lat;
    }
    getLongitude() {
        return this.data.lng;
    }
    getBearing() {
        return this.data.bearing;
    }
    getSpeedKph() {
        return this.data.speedKph;
    }
    getAccuracy() {
        return this.data.accuracy;
    }
    getRideId() {
        return this.data.rideId;
    }
    getClientUpdatedAt() {
        return this.data.updatedAt;
    }
}
exports.DriverLocationUpdateDto = DriverLocationUpdateDto;
//# sourceMappingURL=DriverLocationUpdateDto.js.map