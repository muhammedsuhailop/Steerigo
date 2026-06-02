"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideTimeline = void 0;
class RideTimeline {
    constructor(requestedAt) {
        this.requestedAt = requestedAt;
    }
    setAcceptedAt(date) {
        if (this.acceptedAt)
            throw new Error("Ride already accepted");
        this.acceptedAt = date;
    }
    setArrivedAt(date) {
        if (!this.acceptedAt)
            throw new Error("Driver cannot arrive before accepting the ride");
        if (this.arrivedAt)
            throw new Error("Driver already marked as arrived");
        this.arrivedAt = date;
    }
    setStartedAt(date) {
        if (!this.arrivedAt)
            throw new Error("Ride cannot start before driver arrival");
        if (this.startedAt)
            throw new Error("Ride already started");
        this.startedAt = date;
    }
    setCompletedAt(date) {
        if (!this.startedAt)
            throw new Error("Ride cannot complete before being started");
        if (this.completedAt)
            throw new Error("Ride already completed");
        this.completedAt = date;
        this.paymentFailedAt = undefined;
    }
    setCancelledAt(date) {
        if (this.completedAt || this.cancelledAt)
            throw new Error("Ride already ended");
        this.cancelledAt = date;
    }
    setRejectedAt(date) {
        if (this.acceptedAt)
            throw new Error("Cannot reject after ride is accepted");
        this.rejectedAt = date;
    }
    setPaymentInitiatedAt(date) {
        if (!this.completedAt)
            throw new Error("Payment cannot start before ride completion");
        this.paymentInitiatedAt = date;
    }
    setPaymentCompletedAt(date) {
        if (!this.paymentInitiatedAt)
            throw new Error("Payment cannot complete before initiation");
        this.paymentCompletedAt = date;
    }
    setPaymentFailedAt(date) {
        if (!this.paymentInitiatedAt)
            throw new Error("Payment cannot fail before initiation");
        if (this.paymentCompletedAt)
            return;
        this.paymentFailedAt = date;
    }
    setPaymentRefundedAt(date) {
        if (!this.paymentCompletedAt)
            throw new Error("Refund can only happen after successful payment");
        this.paymentRefundedAt = date;
    }
    getRequestedAt() {
        return this.requestedAt;
    }
    getAcceptedAt() {
        return this.acceptedAt;
    }
    getArrivedAt() {
        return this.arrivedAt;
    }
    getStartedAt() {
        return this.startedAt;
    }
    getCompletedAt() {
        return this.completedAt;
    }
    getCancelledAt() {
        return this.cancelledAt;
    }
    getRejectedAt() {
        return this.rejectedAt;
    }
    getPaymentInitiatedAt() {
        return this.paymentInitiatedAt;
    }
    getPaymentCompletedAt() {
        return this.paymentCompletedAt;
    }
    getPaymentFailedAt() {
        return this.paymentFailedAt;
    }
    getPaymentRefundedAt() {
        return this.paymentRefundedAt;
    }
    getDuration() {
        return this.completedAt && this.startedAt
            ? this.completedAt.getTime() - this.startedAt.getTime()
            : null;
    }
    getPaymentDuration() {
        return this.paymentCompletedAt && this.paymentInitiatedAt
            ? this.paymentCompletedAt.getTime() - this.paymentInitiatedAt.getTime()
            : null;
    }
    static fromData(data) {
        const timeline = new RideTimeline(data.requestedAt || new Date());
        if (data.acceptedAt)
            timeline.setAcceptedAt(data.acceptedAt);
        if (data.arrivedAt)
            timeline.setArrivedAt(data.arrivedAt);
        if (data.startedAt)
            timeline.setStartedAt(data.startedAt);
        if (data.completedAt)
            timeline.setCompletedAt(data.completedAt);
        if (data.cancelledAt)
            timeline.setCancelledAt(data.cancelledAt);
        if (data.rejectedAt)
            timeline.setRejectedAt(data.rejectedAt);
        if (data.paymentInitiatedAt)
            timeline.setPaymentInitiatedAt(data.paymentInitiatedAt);
        if (data.paymentCompletedAt)
            timeline.setPaymentCompletedAt(data.paymentCompletedAt);
        if (data.paymentCompletedAt && data.paymentFailedAt) {
            timeline.setPaymentCompletedAt(data.paymentCompletedAt);
        }
        else {
            if (data.paymentCompletedAt)
                timeline.setPaymentCompletedAt(data.paymentCompletedAt);
            if (data.paymentFailedAt)
                timeline.setPaymentFailedAt(data.paymentFailedAt);
        }
        if (data.paymentRefundedAt)
            timeline.setPaymentRefundedAt(data.paymentRefundedAt);
        return timeline;
    }
    toJSON() {
        return {
            requestedAt: this.requestedAt,
            acceptedAt: this.acceptedAt,
            arrivedAt: this.arrivedAt,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
            cancelledAt: this.cancelledAt,
            rejectedAt: this.rejectedAt,
            paymentInitiatedAt: this.paymentInitiatedAt,
            paymentCompletedAt: this.paymentCompletedAt,
            paymentFailedAt: this.paymentFailedAt,
            paymentRefundedAt: this.paymentRefundedAt,
        };
    }
}
exports.RideTimeline = RideTimeline;
//# sourceMappingURL=RideTimeline.js.map