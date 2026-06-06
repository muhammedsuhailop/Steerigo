"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminRideByIdDto = void 0;
const RideErrors_1 = require("../../../domain/errors/RideErrors");
class GetAdminRideByIdDto {
    constructor(rideId) {
        this.rideId = rideId;
    }
    static fromRequest(params) {
        const dto = new GetAdminRideByIdDto(params.rideId);
        dto.validate();
        return dto;
    }
    validate() {
        if (!this.rideId || this.rideId.trim().length === 0) {
            throw RideErrors_1.RideErrors.rideNotFound("unknown");
        }
    }
}
exports.GetAdminRideByIdDto = GetAdminRideByIdDto;
//# sourceMappingURL=GetAdminRideByIdDto.js.map