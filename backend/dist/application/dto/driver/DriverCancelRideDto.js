"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverCancelRideDto = void 0;
const RideCancellationErrors_1 = require("../../../domain/errors/RideCancellationErrors");
const DriverRideCancellationReason_1 = require("../../../domain/value-objects/DriverRideCancellationReason");
class DriverCancelRideDto {
    constructor(userId, rideId, reason) {
        this.userId = userId;
        this.rideId = rideId;
        this.reason = reason;
    }
    static fromRequest(userId, params, body) {
        const parsedBody = (body ?? {});
        const reason = parsedBody.reason;
        const dto = new DriverCancelRideDto(userId, params.rideId, reason);
        dto.validate();
        return dto;
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.rideId;
    }
    validate() {
        if (!this.userId || this.userId.trim().length === 0) {
            throw RideCancellationErrors_1.RideCancellationErrors.unauthorizedCancellation(this.rideId ?? "unknown");
        }
        if (!this.rideId || this.rideId.trim().length === 0) {
            throw RideCancellationErrors_1.RideCancellationErrors.rideNotFound("unknown");
        }
        if (!this.reason ||
            !Object.values(DriverRideCancellationReason_1.DriverCancellationReason).includes(this.reason)) {
            throw RideCancellationErrors_1.RideCancellationErrors.invalidCancellationReason(this.reason ? String(this.reason) : "undefined");
        }
    }
}
exports.DriverCancelRideDto = DriverCancelRideDto;
//# sourceMappingURL=DriverCancelRideDto.js.map