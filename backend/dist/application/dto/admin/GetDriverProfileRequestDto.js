"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverProfileRequestDto = void 0;
const zod_1 = require("zod");
const getDriverProfileRequestSchema = zod_1.z.object({
    driverId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
});
class GetDriverProfileRequestDto {
    constructor(requestData) {
        this.data = getDriverProfileRequestSchema.parse(requestData);
    }
    static fromData(requestData) {
        return new GetDriverProfileRequestDto(requestData);
    }
    getDriverId() {
        return this.data.driverId;
    }
}
exports.GetDriverProfileRequestDto = GetDriverProfileRequestDto;
//# sourceMappingURL=GetDriverProfileRequestDto.js.map