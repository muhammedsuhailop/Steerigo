"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequest = void 0;
const RideRequestStatus_1 = require("../value-objects/RideRequestStatus");
class RideRequest {
    constructor(id, driverId, driverUserId, riderId, requestGroupId, pickup, drop, pickupTime, timeRequired, rideType, fareBreakdown, status, pickupETA, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.driverId = driverId;
        this.driverUserId = driverUserId;
        this.riderId = riderId;
        this.requestGroupId = requestGroupId;
        this.pickup = pickup;
        this.drop = drop;
        this.pickupTime = pickupTime;
        this.timeRequired = timeRequired;
        this.rideType = rideType;
        this.fareBreakdown = fareBreakdown;
        this.status = status;
        this.pickupETA = pickupETA;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(driverId, driverUserId, riderId, requestGroupId, pickup, drop, pickupTime, timeRequired, rideType, fareBreakdown, pickupETA) {
        if (fareBreakdown.getTotalFare().getAmount() <= 0) {
            throw new Error("Total fare must be positive");
        }
        return new RideRequest("", driverId, driverUserId, riderId, requestGroupId, pickup, drop, pickupTime, timeRequired, rideType, fareBreakdown, RideRequestStatus_1.RideRequestStatus.PENDING, pickupETA);
    }
    static fromData(data) {
        return new RideRequest(data.id, data.driverId, data.driverUserId, data.riderId, data.requestGroupId, data.pickup, data.drop, data.pickupTime, data.timeRequired, data.rideType, data.fareBreakdown, data.status, data.pickupETA, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
    }
    getDriverId() {
        return this.driverId;
    }
    getDriverUserId() {
        return this.driverUserId;
    }
    getRiderId() {
        return this.riderId;
    }
    getPickup() {
        return this.pickup;
    }
    getDrop() {
        return this.drop;
    }
    getPickupTime() {
        return this.pickupTime;
    }
    getTimeRequired() {
        return this.timeRequired;
    }
    getRideType() {
        return this.rideType;
    }
    getFareBreakdown() {
        return this.fareBreakdown;
    }
    getFare() {
        return this.fareBreakdown.getTotalFare().getAmount();
    }
    getStatus() {
        return this.status;
    }
    getPickupETA() {
        return this.pickupETA;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getRequestGroupId() {
        return this.requestGroupId;
    }
    setId(id) {
        this.id = id;
    }
    // Status check methods
    isPending() {
        return this.status === RideRequestStatus_1.RideRequestStatus.PENDING;
    }
    isAccepted() {
        return this.status === RideRequestStatus_1.RideRequestStatus.ACCEPTED;
    }
    isRejected() {
        return this.status === RideRequestStatus_1.RideRequestStatus.REJECTED;
    }
    isExpired() {
        return this.status === RideRequestStatus_1.RideRequestStatus.EXPIRED;
    }
    // Status mutation methods
    markAsAccepted() {
        if (!this.isPending()) {
            throw new Error("Only pending requests can be accepted");
        }
        this.status = RideRequestStatus_1.RideRequestStatus.ACCEPTED;
        this.updatedAt = new Date();
    }
    markAsRejected() {
        if (!this.isPending()) {
            throw new Error("Only pending requests can be rejected");
        }
        this.status = RideRequestStatus_1.RideRequestStatus.REJECTED;
        this.updatedAt = new Date();
    }
    markAsExpired() {
        if (!this.isPending()) {
            throw new Error("Only pending requests can be expired");
        }
        this.status = RideRequestStatus_1.RideRequestStatus.EXPIRED;
        this.updatedAt = new Date();
    }
    markAsCancelled() {
        this.status = RideRequestStatus_1.RideRequestStatus.CANCELLED;
        this.updatedAt = new Date();
    }
}
exports.RideRequest = RideRequest;
//# sourceMappingURL=RideRequest.js.map