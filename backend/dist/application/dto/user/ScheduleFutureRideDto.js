"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleFutureRideDto = void 0;
const ValidationErrors_1 = require("../../../domain/errors/ValidationErrors");
const FutureRideErrors_1 = require("../../../domain/errors/FutureRideErrors");
const AppConstants_1 = require("../../../shared/constants/AppConstants");
class ScheduleFutureRideDto {
    constructor(requestGroupId, riderId, latitude, longitude, pickupTime, radiusKm, gearType, bodyType, maxCandidates, dropLatitude, dropLongitude, dropAddress, pickupAddress, rideType, requiredDuration) {
        this.requestGroupId = requestGroupId;
        this.riderId = riderId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pickupTime = pickupTime;
        this.radiusKm = radiusKm;
        this.gearType = gearType;
        this.bodyType = bodyType;
        this.maxCandidates = maxCandidates;
        this.dropLatitude = dropLatitude;
        this.dropLongitude = dropLongitude;
        this.dropAddress = dropAddress;
        this.pickupAddress = pickupAddress;
        this.rideType = rideType;
        this.requiredDuration = requiredDuration;
    }
    static fromRequest(riderId, requestBody) {
        const body = (requestBody ?? {});
        const parsedPickupTime = typeof body.pickupTime === "string"
            ? new Date(body.pickupTime)
            : new Date();
        return new ScheduleFutureRideDto(body.requestGroupId, riderId, body.latitude, body.longitude, parsedPickupTime, body.radiusKm && body.radiusKm > 0
            ? body.radiusKm
            : AppConstants_1.AppConstants.FUTURE_RIDE_DEFAULT_RADIUS_KM, body.gearType ? body.gearType.trim() : "", body.bodyType ? body.bodyType.trim() : "", body.maxCandidates && body.maxCandidates > 0
            ? body.maxCandidates
            : AppConstants_1.AppConstants.FUTURE_RIDE_MAX_CANDIDATES, body.dropLatitude, body.dropLongitude, body.dropAddress, body.pickupAddress, body.rideType, body.requiredDuration);
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (typeof this.latitude !== "number" ||
            this.latitude < -90 ||
            this.latitude > 90) {
            throw new ValidationErrors_1.InvalidLatitudeError();
        }
        if (typeof this.longitude !== "number" ||
            this.longitude < -180 ||
            this.longitude > 180) {
            throw new ValidationErrors_1.InvalidLongitudeError();
        }
        if (!this.requestGroupId || this.requestGroupId.trim().length === 0) {
            throw new Error("requestGroupId is required");
        }
        if (!this.pickupTime ||
            !(this.pickupTime instanceof Date) ||
            isNaN(this.pickupTime.getTime())) {
            throw FutureRideErrors_1.FutureRideErrors.pickupTimeTooSoon();
        }
        const sixHoursFromNow = new Date(Date.now() + AppConstants_1.AppConstants.FUTURE_RIDE_MIN_HOURS_AHEAD * 60 * 60 * 1000);
        if (this.pickupTime < sixHoursFromNow) {
            throw FutureRideErrors_1.FutureRideErrors.pickupTimeTooSoon();
        }
        if (typeof this.dropLatitude !== "number" ||
            this.dropLatitude < -90 ||
            this.dropLatitude > 90) {
            throw new ValidationErrors_1.InvalidLatitudeError();
        }
        if (typeof this.dropLongitude !== "number" ||
            this.dropLongitude < -180 ||
            this.dropLongitude > 180) {
            throw new ValidationErrors_1.InvalidLongitudeError();
        }
        if (!["One Way", "Round Trip"].includes(this.rideType)) {
            throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
        }
    }
    getAvailabilityCheckTime() {
        return new Date(this.pickupTime.getTime() -
            AppConstants_1.AppConstants.FUTURE_RIDE_AVAILABILITY_BUFFER_HOURS * 60 * 60 * 1000);
    }
}
exports.ScheduleFutureRideDto = ScheduleFutureRideDto;
//# sourceMappingURL=ScheduleFutureRideDto.js.map