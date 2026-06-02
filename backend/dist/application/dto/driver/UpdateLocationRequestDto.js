"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLocationRequestDto = void 0;
const zod_1 = require("zod");
const updateLocationSchema = zod_1.z.object({
    driverId: zod_1.z.string().min(1, "driverId is required"),
    currentLocation: zod_1.z.object({
        latitude: zod_1.z
            .number()
            .min(-90, "Latitude must be between -90 and 90")
            .max(90, "Latitude must be between -90 and 90"),
        longitude: zod_1.z
            .number()
            .min(-180, "Longitude must be between -180 and 180")
            .max(180, "Longitude must be between -180 and 180"),
        address: zod_1.z
            .string()
            .max(500, "Address cannot exceed 500 characters")
            .optional(),
    }),
});
class UpdateLocationRequestDto {
    constructor(requestData) {
        this.data = updateLocationSchema.parse(requestData);
    }
    static fromRequest(requestBody) {
        return new UpdateLocationRequestDto(requestBody);
    }
    getLocationData() {
        return this.data.currentLocation;
    }
    getDriverId() {
        return this.data.driverId;
    }
}
exports.UpdateLocationRequestDto = UpdateLocationRequestDto;
//# sourceMappingURL=UpdateLocationRequestDto.js.map