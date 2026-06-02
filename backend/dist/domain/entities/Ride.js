"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const BookingType_1 = require("@domain/value-objects/BookingType");
class Ride {
    constructor(id, rideId, driverId, riderId, status, paymentStatus, pickup, drop, requestedPickupTime, timeRequired, rideType, bookingType, fareBreakdown, currency = "INR", timeline, verificationCode, createdAt = new Date(), updatedAt = new Date(), couponDetails) {
        this.id = id;
        this.rideId = rideId;
        this.driverId = driverId;
        this.riderId = riderId;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.pickup = pickup;
        this.drop = drop;
        this.requestedPickupTime = requestedPickupTime;
        this.timeRequired = timeRequired;
        this.rideType = rideType;
        this.bookingType = bookingType;
        this.fareBreakdown = fareBreakdown;
        this.currency = currency;
        this.timeline = timeline;
        this.verificationCode = verificationCode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.couponDetails = couponDetails;
    }
    static create(id, rideId, driverId, riderId, pickup, drop, requestedPickupTime, timeRequired, rideType, bookingType, fareBreakdown, timeline, verificationCode) {
        if (!id || !rideId || !driverId || !riderId) {
            throw new Error("All ID fields are required");
        }
        if (!rideType || rideType.trim() === "") {
            throw new Error("Ride type is required");
        }
        return new Ride(id, rideId, driverId, riderId, RideStatus_1.RideStatus.REQUESTED, PaymentStatus_1.PaymentStatus.PENDING, pickup, drop, requestedPickupTime, timeRequired, rideType, bookingType, fareBreakdown, "INR", timeline, verificationCode, undefined);
    }
    static fromData(data) {
        return new Ride(data.id, data.rideId, data.driverId, data.riderId, data.status, data.paymentStatus, data.pickup, data.drop, data.requestedPickupTime, data.timeRequired, data.rideType, data.bookingType, data.fareBreakdown, data.currency, data.timeline, data.verificationCode, data.createdAt, data.updatedAt, data.couponDetails);
    }
    getId() {
        return this.id;
    }
    getRideId() {
        return this.rideId;
    }
    getDriverId() {
        return this.driverId;
    }
    getRiderId() {
        return this.riderId;
    }
    getStatus() {
        return this.status;
    }
    getPickup() {
        return this.pickup;
    }
    getrequestedPickupTime() {
        return this.requestedPickupTime;
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
    getBookingType() {
        return this.bookingType;
    }
    isInstantBooking() {
        return this.bookingType === BookingType_1.BookingType.INSTANT;
    }
    isScheduledBooking() {
        return this.bookingType === BookingType_1.BookingType.SCHEDULED;
    }
    getFareBreakdown() {
        return this.fareBreakdown;
    }
    getCurrency() {
        return this.currency;
    }
    getTimeline() {
        return this.timeline;
    }
    getVerificationCode() {
        return this.verificationCode;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    getFare() {
        return this.fareBreakdown.getTotalFare().getAmount();
    }
    getPaymentStatus() {
        return this.paymentStatus;
    }
    getCouponDetails() {
        return this.couponDetails;
    }
    hasCouponApplied() {
        return !!this.couponDetails;
    }
    // Status checks
    isRequested() {
        return this.status === RideStatus_1.RideStatus.REQUESTED;
    }
    isAccepted() {
        return this.status === RideStatus_1.RideStatus.ACCEPTED;
    }
    isArrived() {
        return this.status === RideStatus_1.RideStatus.ARRIVED;
    }
    isStarted() {
        return this.status === RideStatus_1.RideStatus.STARTED;
    }
    isCompleted() {
        return this.status === RideStatus_1.RideStatus.COMPLETED;
    }
    isCancelled() {
        return this.status === RideStatus_1.RideStatus.CANCELLED;
    }
    // Timeline convenience getters
    getArrivedAt() {
        return this.timeline.getArrivedAt();
    }
    getStartedAt() {
        return this.timeline.getStartedAt();
    }
    getCompletedAt() {
        return this.timeline.getCompletedAt();
    }
    getCancelledAt() {
        return this.timeline.getCancelledAt();
    }
    getRideDurationMs() {
        const startedAt = this.getStartedAt();
        const completedAt = this.getCompletedAt();
        if (!startedAt || !completedAt)
            return undefined;
        return completedAt.getTime() - startedAt.getTime();
    }
    getFormattedRideDuration() {
        const durationMs = this.getRideDurationMs();
        if (!durationMs)
            return "00:00:00";
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    getElapsedTimeFromStart() {
        const startedAt = this.getStartedAt();
        if (!startedAt)
            return "00:00:00";
        const diff = new Date().getTime() - startedAt.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    // Status transitions
    setStatusToAccepted() {
        if (this.status !== RideStatus_1.RideStatus.REQUESTED) {
            throw new Error("Only requested rides can be accepted");
        }
        this.status = RideStatus_1.RideStatus.ACCEPTED;
    }
    setStatusToArrived() {
        if (!this.isAccepted()) {
            throw new Error("Only accepted rides can be marked as arrived");
        }
        this.status = RideStatus_1.RideStatus.ARRIVED;
        this.timeline.setArrivedAt(new Date());
    }
    setStatusToStarted() {
        if (!this.isAccepted() && !this.isArrived()) {
            throw new Error("Only accepted or arrived rides can be started");
        }
        if (this.isAccepted() && !this.timeline.getArrivedAt()) {
            this.timeline.setArrivedAt(new Date());
        }
        this.status = RideStatus_1.RideStatus.STARTED;
        this.timeline.setStartedAt(new Date());
    }
    completeWithFareBreakdown(finalFareBreakdown) {
        if (!this.isStarted()) {
            throw new Error("Only started rides can be completed");
        }
        this.fareBreakdown = finalFareBreakdown;
        this.status = RideStatus_1.RideStatus.COMPLETED;
        this.timeline.setCompletedAt(new Date());
    }
    setStatusToCompleted() {
        if (!this.isStarted()) {
            throw new Error("Only started rides can be completed");
        }
        this.status = RideStatus_1.RideStatus.COMPLETED;
        this.timeline.setCompletedAt(new Date());
    }
    setStatusToCancelled() {
        if (this.isCancelled()) {
            throw new Error("Ride is already cancelled");
        }
        this.status = RideStatus_1.RideStatus.CANCELLED;
        this.timeline.setCancelledAt(new Date());
    }
    cancelWithFareBreakdown(resolvedFare) {
        if (this.isCancelled()) {
            throw new Error("Ride is already cancelled");
        }
        if (this.isCompleted()) {
            throw new Error("Completed rides cannot be cancelled");
        }
        if (this.isStarted()) {
            throw new Error("Started rides cannot be cancelled by rider");
        }
        this.fareBreakdown = resolvedFare;
        this.status = RideStatus_1.RideStatus.CANCELLED;
        this.timeline.setCancelledAt(new Date());
    }
    cancelByDriver(resolvedFare) {
        if (this.isCancelled()) {
            throw new Error("Ride is already cancelled");
        }
        if (this.isCompleted()) {
            throw new Error("Completed rides cannot be cancelled");
        }
        this.fareBreakdown = resolvedFare;
        this.status = RideStatus_1.RideStatus.CANCELLED;
        this.timeline.setCancelledAt(new Date());
    }
    applyCoupon(couponId, code, discountAmount, discountType, recalculate = false) {
        if (this.paymentStatus !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error("Payment already processed.");
        }
        if (this.couponDetails && !recalculate) {
            throw new Error("Coupon already applied.");
        }
        if (discountAmount <= 0) {
            throw new Error("Discount must be greater than zero.");
        }
        if (discountAmount > this.getFare()) {
            throw new Error("Discount exceeds fare.");
        }
        this.couponDetails = {
            couponId,
            code,
            discountAmount,
            discountType,
        };
    }
    removeCoupon() {
        if (this.paymentStatus !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error("Cannot remove coupon: Payment is already processed or completed.");
        }
        if (!this.couponDetails) {
            throw new Error("No coupon applied to remove.");
        }
        this.couponDetails = undefined;
    }
    getDiscountAmount() {
        return this.couponDetails?.discountAmount ?? 0;
    }
    getPayableAmount() {
        const payable = this.getFare() - this.getDiscountAmount();
        return Math.max(0, payable);
    }
    updatePaymentStatus(status) {
        this.paymentStatus = status;
    }
}
exports.Ride = Ride;
//# sourceMappingURL=Ride.js.map