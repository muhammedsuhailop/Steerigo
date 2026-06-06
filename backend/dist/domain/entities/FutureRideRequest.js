"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureRideRequest = void 0;
const FutureRideRequestStatus_1 = require("../value-objects/FutureRideRequestStatus");
class FutureRideRequest {
    constructor(id, riderId, driverId, driverUserId, requestGroupId, pickup, drop, pickupTime, requiredDuration, rideType, fareBreakdown, status, pickupETA, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.riderId = riderId;
        this.driverId = driverId;
        this.driverUserId = driverUserId;
        this.requestGroupId = requestGroupId;
        this.pickup = pickup;
        this.drop = drop;
        this.pickupTime = pickupTime;
        this.requiredDuration = requiredDuration;
        this.rideType = rideType;
        this.fareBreakdown = fareBreakdown;
        this.status = status;
        this.pickupETA = pickupETA;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        if (params.pickupTime <= new Date()) {
            throw new Error("Pickup time must be future date");
        }
        if (params.fareBreakdown.getTotalFare().getAmount() <= 0) {
            throw new Error("Total fare must be positive");
        }
        return new FutureRideRequest("", params.riderId, null, null, params.requestGroupId, params.pickup, params.drop, params.pickupTime, params.requiredDuration, params.rideType, params.fareBreakdown, FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING, params.pickupETA);
    }
    static fromData(data) {
        return new FutureRideRequest(data.id, data.riderId, data.driverId, data.driverUserId, data.requestGroupId, data.pickup, data.drop, data.pickupTime, data.requiredDuration, data.rideType, data.fareBreakdown, data.status, data.pickupETA, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
    }
    getRiderId() {
        return this.riderId;
    }
    getDriverId() {
        return this.driverId;
    }
    getDriverUserId() {
        return this.driverUserId;
    }
    getRequestGroupId() {
        return this.requestGroupId;
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
    getrequiredDuration() {
        return this.requiredDuration;
    }
    getrequiredHours() {
        return Number((this.requiredDuration / 60).toFixed(2));
    }
    getRideType() {
        return this.rideType;
    }
    getFareBreakdown() {
        return this.fareBreakdown;
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
    assignDriver(driverId, driverUserId) {
        if (this.status !== FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING) {
            throw new Error("Only pending request can assign driver");
        }
        this.driverId = driverId;
        this.driverUserId = driverUserId;
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED;
        this.updatedAt = new Date();
    }
    markAccepted() {
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.ACCEPTED;
        this.updatedAt = new Date();
    }
    markRejected() {
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.REJECTED;
        this.updatedAt = new Date();
    }
    markExpired() {
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.EXPIRED;
        this.updatedAt = new Date();
    }
    markCancelled() {
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.CANCELLED;
        this.updatedAt = new Date();
    }
    markCompleted() {
        this.status = FutureRideRequestStatus_1.FutureRideRequestStatus.COMPLETED;
        this.updatedAt = new Date();
    }
    setId(id) {
        this.id = id;
    }
}
exports.FutureRideRequest = FutureRideRequest;
//# sourceMappingURL=FutureRideRequest.js.map