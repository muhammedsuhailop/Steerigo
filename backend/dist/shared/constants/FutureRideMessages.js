"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUTURE_RIDE_SUCCESS_MESSAGES = exports.FUTURE_RIDE_ERROR_MESSAGES = void 0;
exports.FUTURE_RIDE_ERROR_MESSAGES = {
    NO_DRIVERS_FOUND: "No drivers available near your pickup area for the scheduled time.",
    REQUEST_GROUP_NOT_FOUND: "Scheduled ride request group '{{requestGroupId}}' not found.",
    UNAUTHORIZED_CANCELLATION: "You are not authorized to cancel this ride request'.",
    CANNOT_CANCEL: "This ride request cannot be cancelled. Current status: {{status}}.",
    PICKUP_TIME_TOO_SOON: "Pickup time must be at least 6 hours from now.",
    INVALID_PICKUP_TIME: "Invalid pickup time provided.",
    SCHEDULE_FAILED: "Failed to schedule future ride request.",
    TIME_SLOT_CONFLICT: "You already have another scheduled ride during this time slot.",
};
exports.FUTURE_RIDE_SUCCESS_MESSAGES = {
    SCHEDULED: "Your ride has been scheduled. Drivers have been notified.",
    CANCELLED: "Your scheduled ride has been successfully cancelled.",
    REJECTED: "Future ride request has been rejected successfully.",
    REQUESTS_FETCHED: "Your Future Requests fetched successfully",
};
//# sourceMappingURL=FutureRideMessages.js.map