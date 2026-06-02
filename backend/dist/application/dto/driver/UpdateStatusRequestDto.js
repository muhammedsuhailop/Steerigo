"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusRequestDto = void 0;
const zod_1 = require("zod");
const AvailabilityStatus_1 = require("@domain/value-objects/AvailabilityStatus");
const updateStatusSchema = zod_1.z.object({
    driverId: zod_1.z.string().min(1, "driverId is required"),
    status: zod_1.z.enum(AvailabilityStatus_1.VALID_AVAILABILITY_STATUSES, {
        message: `Status must be one of: ${AvailabilityStatus_1.VALID_AVAILABILITY_STATUSES.join(", ")}`,
    }),
});
class UpdateStatusRequestDto {
    constructor(requestData) {
        this.data = updateStatusSchema.parse(requestData);
    }
    static fromRequest(requestBody) {
        return new UpdateStatusRequestDto(requestBody);
    }
    getStatus() {
        return this.data.status;
    }
    getDriverId() {
        return this.data.driverId;
    }
}
exports.UpdateStatusRequestDto = UpdateStatusRequestDto;
//# sourceMappingURL=UpdateStatusRequestDto.js.map