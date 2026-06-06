"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverActionRequestDto = void 0;
const zod_1 = require("zod");
const driverActionRequestSchema = zod_1.z.object({
    driverId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    action: zod_1.z.enum(["block", "suspend", "activate"], {
        message: "Action must be one of: block, suspend, activate",
    }),
    reason: zod_1.z.string().min(1).max(500).optional(),
});
class DriverActionRequestDto {
    constructor(requestData) {
        this.data = driverActionRequestSchema.parse(requestData);
    }
    static fromRequest(driverId, requestBody) {
        const body = (requestBody ?? {});
        const mergedData = {
            driverId,
            action: body.action,
            reason: body.reason,
        };
        return new DriverActionRequestDto(mergedData);
    }
    getDriverId() {
        return this.data.driverId;
    }
    getAction() {
        return this.data.action;
    }
    getReason() {
        return this.data.reason;
    }
    validate() {
        const errors = [];
        // Additional reason validation
        if (this.data.reason) {
            if (this.data.reason.length < 1) {
                errors.push("Reason, if provided, cannot be empty");
            }
            if (this.data.reason.length > 500) {
                errors.push("Reason cannot be longer than 500 characters");
            }
        }
        return errors;
    }
}
exports.DriverActionRequestDto = DriverActionRequestDto;
//# sourceMappingURL=DriverActionRequestDto.js.map