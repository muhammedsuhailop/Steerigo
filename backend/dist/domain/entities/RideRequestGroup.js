"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestGroup = void 0;
const RideRequestGroupStatus_1 = require("../value-objects/RideRequestGroupStatus");
class RideRequestGroup {
    constructor(id, riderId, pickup, drop, timeRequired, rideType, fareBreakdown, candidateDriverIds, currentIndex, status, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.riderId = riderId;
        this.pickup = pickup;
        this.drop = drop;
        this.timeRequired = timeRequired;
        this.rideType = rideType;
        this.fareBreakdown = fareBreakdown;
        this.candidateDriverIds = candidateDriverIds;
        this.currentIndex = currentIndex;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, riderId, pickup, drop, timeRequired, rideType, fareBreakdown, candidateDriverIds) {
        if (!id) {
            throw new Error("RideRequestGroup id is required");
        }
        if (candidateDriverIds.length === 0) {
            throw new Error("RideRequestGroup must have at least one candidate driver");
        }
        return new RideRequestGroup(id, riderId, pickup, drop, timeRequired, rideType, fareBreakdown, [...candidateDriverIds], 0, RideRequestGroupStatus_1.RideRequestGroupStatus.SEARCHING);
    }
    static fromData(data) {
        return new RideRequestGroup(data.id, data.riderId, data.pickup, data.drop, data.timeRequired, data.rideType, data.fareBreakdown, [...data.candidateDriverIds], data.currentIndex, data.status, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
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
    getTimeRequired() {
        return this.timeRequired;
    }
    getRideType() {
        return this.rideType;
    }
    getFareBreakdown() {
        return this.fareBreakdown;
    }
    getCandidateDriverIds() {
        return [...this.candidateDriverIds];
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getStatus() {
        return this.status;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    markCompleted() {
        if (this.status === RideRequestGroupStatus_1.RideRequestGroupStatus.COMPLETED) {
            return;
        }
        this.status = RideRequestGroupStatus_1.RideRequestGroupStatus.COMPLETED;
        this.updatedAt = new Date();
    }
    markExpired() {
        if (this.status === RideRequestGroupStatus_1.RideRequestGroupStatus.EXPIRED) {
            return;
        }
        this.status = RideRequestGroupStatus_1.RideRequestGroupStatus.EXPIRED;
        this.updatedAt = new Date();
    }
    markCancelled() {
        if (this.status === RideRequestGroupStatus_1.RideRequestGroupStatus.CANCELLED) {
            return;
        }
        this.status = RideRequestGroupStatus_1.RideRequestGroupStatus.CANCELLED;
        this.updatedAt = new Date();
    }
    incrementCurrentIndex() {
        if (this.currentIndex < this.candidateDriverIds.length - 1) {
            this.currentIndex += 1;
            this.updatedAt = new Date();
        }
    }
    replaceCandidateDriverIds(candidateDriverIds) {
        if (candidateDriverIds.length === 0) {
            throw new Error("candidateDriverIds cannot be empty");
        }
        this.candidateDriverIds = [...candidateDriverIds];
        this.currentIndex = 0;
        this.updatedAt = new Date();
    }
}
exports.RideRequestGroup = RideRequestGroup;
//# sourceMappingURL=RideRequestGroup.js.map