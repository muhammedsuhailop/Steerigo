export declare const RIDE_MESSAGES: {
    RIDE_REQUEST_ACCEPTED: string;
    RIDE_REQUEST_REJECTED: string;
    PENDING_REQUESTS_FETCHED: string;
    RIDES_FETCHED_SUCCESSFULLY: string;
    RIDE_FETCHED_SUCCESSFULLY: string;
    DRIVER_ARRIVED_AT_PICKUP: string;
    RIDE_STARTED: string;
    RIDE_STARTED_WITH_AUTO_ARRIVED: string;
    RIDE_COMPLETED: string;
    RIDE_RATED: string;
    RIDE_CANCELLED: string;
};
export declare const RIDE_ERROR_MESSAGES: {
    readonly RIDE_NOT_FOUND: "Ride with ID {{rideId}} not found";
    readonly RIDE_ALREADY_ACCEPTED: "Ride {{rideId}} has already been accepted";
    readonly RIDE_ALREADY_STARTED: "Ride {{rideId}} has already been started";
    readonly RIDE_ALREADY_COMPLETED: "Ride {{rideId}} has already been completed";
    readonly RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has been cancelled";
    readonly DRIVER_HAS_ACTIVE_RIDE: "Driver {{driverId}} already has an active ride: {{rideId}}";
    readonly RIDER_HAS_ACTIVE_RIDE: "Rider {{riderId}} already has an active ride: {{rideId}}";
    readonly INVALID_STATUS_TRANSITION: "Cannot transition ride {{rideId}} from {{from}} to {{to}}";
    readonly RIDE_CREATION_FAILED: "Failed to create ride: {{reason}}";
    readonly UNAUTHORIZED_RIDE_ACCESS: "You are not authorized to access ride {{rideId}}";
    readonly CANNOT_MARK_AS_ARRIVED: "Cannot mark ride {{rideId}} as arrived from status {{currentStatus}}. Only accepted rides can be marked as arrived.";
    readonly CANNOT_RATE_INCOMPLETE_RIDE: "Cannot rate ride {{rideId}} because it is not yet completed";
    readonly RIDE_ALREADY_RATED: "Ride {{rideId}} has already been rated by you";
    readonly DRIVER_NOT_FOUND_FOR_RIDE: "No driver found associated with ride {{rideId}}";
    readonly INVALID_RATING_VALUE: "Rating values must be between 0.5 and 5";
    readonly INVALID_RATING_DATA: "Invalid rating data provided: {{reason}}";
    readonly RIDE_NOT_ELIGIBLE_FOR_COUPON: "Ride '{rideId}' with status {{currentStatus}} is not eligible for a coupon";
    readonly INVALID_VERIFICATION_CODE: "Invalid verification code";
};
export declare const RIDE_CANCELLATION_ERROR_MESSAGES: {
    readonly RIDE_NOT_FOUND: "Ride with ID {{rideId}} was not found.";
    readonly UNAUTHORIZED_CANCELLATION: "You are not authorized to cancel ride {rideId}.";
    readonly RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has already been cancelled.";
    readonly CANNOT_CANCEL_COMPLETED_RIDE: "Ride {{rideId}} cannot be cancelled because it has already been completed.";
    readonly CANNOT_CANCEL_STARTED_RIDE: "Ride {{rideId}} cannot be cancelled after it has started.";
    readonly CHARGE_CALCULATION_FAILED: "Failed to calculate the cancellation charge for ride {{rideId}}: {{reason}}.";
    readonly FARE_RESET_FAILED: "Failed to reset fare breakdown for ride {rideId}: {reason}.";
    readonly INVALID_CANCELLATION_REASON: "{{reason}} is not a valid cancellation reason.";
};
export declare const DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES: {
    readonly RIDE_NOT_FOUND: "Ride with ID {{rideId}} was not found.";
    readonly DRIVER_NOT_FOUND: "Driver with user ID {{userId}} was not found.";
    readonly UNAUTHORIZED_CANCELLATION: "Driver {{driverId}} is not authorized to cancel ride {{rideId}}.";
    readonly RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has already been cancelled.";
    readonly CANNOT_CANCEL_COMPLETED_RIDE: "Ride {{rideId}} cannot be cancelled because it has already been completed.";
    readonly CHARGE_CALCULATION_FAILED: "Failed to calculate the cancellation outcome for ride {{rideId}}: {{reason}}.";
    readonly FARE_RESET_FAILED: "Failed to reset fare breakdown for ride {{rideId}}: {{reason}}.";
    readonly INVALID_CANCELLATION_REASON: "{{reason}} is not a valid driver cancellation reason.";
    readonly WALLET_NOT_FOUND: "Wallet not found for driver {{driverId}}.";
};
//# sourceMappingURL=RideMessages.d.ts.map