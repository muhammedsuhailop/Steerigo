"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRideRequestDto = void 0;
const errors_1 = require("../../../domain/errors");
const FareBreakdown_1 = require("../../../domain/value-objects/FareBreakdown");
const Money_1 = require("../../../domain/value-objects/Money");
class SendRideRequestDto {
    constructor(requestGroupId, riderId, driverId, pickupLatitude, pickupLongitude, pickupAddress, dropLatitude, dropLongitude, dropAddress, pickupTime, timeRequired, rideType, fareBreakdown, pickupETA) {
        this.requestGroupId = requestGroupId;
        this.riderId = riderId;
        this.driverId = driverId;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.pickupAddress = pickupAddress;
        this.dropLatitude = dropLatitude;
        this.dropLongitude = dropLongitude;
        this.dropAddress = dropAddress;
        this.pickupTime = pickupTime;
        this.timeRequired = timeRequired;
        this.rideType = rideType;
        this.fareBreakdown = fareBreakdown;
        this.pickupETA = pickupETA;
    }
    static fromRequest(riderId, requestBody) {
        const body = (requestBody ?? {});
        const { requestGroupId, driverId, pickup, drop, pickupTime, timeRequired, rideType, fareBreakdown: fareBreakdownData, pickupETA, } = body;
        if (!driverId?.trim()) {
            throw new Error("Driver ID is required");
        }
        if (!pickupTime) {
            throw new Error("Pickup time is required");
        }
        if (!timeRequired) {
            throw new Error("Required Time is required");
        }
        if (!rideType?.trim()) {
            throw new Error("Ride type is required");
        }
        if (!fareBreakdownData) {
            throw new Error("Fare breakdown is required");
        }
        if (!pickupETA?.trim()) {
            throw new Error("Pickup ETA is required");
        }
        const baseFare = Money_1.Money.create(fareBreakdownData.baseFare.amount, fareBreakdownData.baseFare.currency);
        const platformFee = Money_1.Money.create(fareBreakdownData.platformFee.amount, fareBreakdownData.platformFee.currency);
        const fareTax = {
            name: fareBreakdownData.taxes.fare.name,
            rate: fareBreakdownData.taxes.fare.rate,
            amount: Money_1.Money.create(fareBreakdownData.taxes.fare.amount.amount, fareBreakdownData.taxes.fare.amount.currency),
        };
        const platformFeeTax = {
            name: fareBreakdownData.taxes.platformFee.name,
            rate: fareBreakdownData.taxes.platformFee.rate,
            amount: Money_1.Money.create(fareBreakdownData.taxes.platformFee.amount.amount, fareBreakdownData.taxes.platformFee.amount.currency),
        };
        const totalFare = Money_1.Money.create(fareBreakdownData.totalFare.amount, fareBreakdownData.totalFare.currency);
        const fareBreakdown = FareBreakdown_1.FareBreakdown.create({
            baseFare,
            platformFee,
            fareTax,
            platformFeeTax,
            totalFare,
            durationHours: fareBreakdownData.durationHours,
        });
        return new SendRideRequestDto(requestGroupId, riderId, driverId, pickup.latitude, pickup.longitude, pickup.address, drop.latitude, drop.longitude, drop.address, new Date(pickupTime), timeRequired, rideType, fareBreakdown, pickupETA);
    }
    validate() {
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw new Error("Rider ID is required");
        }
        if (!this.driverId || this.driverId.trim().length === 0) {
            throw new Error("Driver ID is required");
        }
        if (!this.requestGroupId) {
            throw new errors_1.DomainError("RequestGroupId is required");
        }
        if (!this.fareBreakdown) {
            throw new Error("Fare breakdown is required");
        }
        if (this.fareBreakdown.getTotalFare().getAmount() <= 0) {
            throw new Error("Total fare must be positive");
        }
        if (this.pickupLatitude < -90 ||
            this.pickupLatitude > 90 ||
            this.pickupLongitude < -180 ||
            this.pickupLongitude > 180) {
            throw new Error("Invalid pickup location coordinates");
        }
        if (this.dropLatitude < -90 ||
            this.dropLatitude > 90 ||
            this.dropLongitude < -180 ||
            this.dropLongitude > 180) {
            throw new Error("Invalid drop location coordinates");
        }
        if (!["One Way", "Round Trip"].includes(this.rideType)) {
            throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
        }
        if (this.pickupTime < new Date()) {
            throw new Error("Pickup time must be in the future");
        }
        if (this.timeRequired < 1 || this.timeRequired > 12) {
            throw new Error("You can only book for rides duration of minimum 1 hours to maximum 12 hours.");
        }
        if (!this.pickupETA || this.pickupETA.trim().length === 0) {
            throw new Error("Pickup ETA is required");
        }
    }
}
exports.SendRideRequestDto = SendRideRequestDto;
//# sourceMappingURL=SendRideRequestDto.js.map