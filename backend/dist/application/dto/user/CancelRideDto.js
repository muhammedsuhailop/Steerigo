"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelRideDto = void 0;
const RideCancellationErrors_1 = require("../../../domain/errors/RideCancellationErrors");
const RideCancellationReason_1 = require("../../../domain/value-objects/RideCancellationReason");
class CancelRideDto {
    constructor(riderId, rideId, reason) {
        this.riderId = riderId;
        this.rideId = rideId;
        this.reason = reason;
    }
    static fromRequest(riderId, params, body) {
        const parsedBody = (body ?? {});
        const reason = parsedBody.reason;
        const effectiveRideId = params.rideId;
        const dto = new CancelRideDto(riderId, effectiveRideId, reason);
        dto.validate();
        return dto;
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw RideCancellationErrors_1.RideCancellationErrors.unauthorizedCancellation("unknown");
        }
        if (!this.rideId || this.rideId.trim().length === 0) {
            throw RideCancellationErrors_1.RideCancellationErrors.rideNotFound("unknown");
        }
        if (!this.reason ||
            !Object.values(RideCancellationReason_1.RideCancellationReason).includes(this.reason)) {
            throw RideCancellationErrors_1.RideCancellationErrors.invalidCancellationReason(this.reason ?? "");
        }
    }
}
exports.CancelRideDto = CancelRideDto;
//# sourceMappingURL=CancelRideDto.js.map