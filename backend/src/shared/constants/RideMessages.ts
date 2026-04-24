export const RIDE_MESSAGES = {
  RIDE_REQUEST_ACCEPTED: "Ride request accepted successfully",
  RIDE_REQUEST_REJECTED: "Ride request rejected successfully",
  PENDING_REQUESTS_FETCHED: "Pending ride requests fetched successfully",
  RIDES_FETCHED_SUCCESSFULLY: "Rides fetched successfully ",
  RIDE_FETCHED_SUCCESSFULLY: "Ride details fetched successfully",
  DRIVER_ARRIVED_AT_PICKUP: "Driver has arrived at pickup location",
  RIDE_STARTED: "Ride has started",
  RIDE_STARTED_WITH_AUTO_ARRIVED:
    "Ride has started. Driver arrival has been automatically recorded",
  RIDE_COMPLETED: "Ride completed successfully",
  RIDE_RATED: "Ride rated successfully",
};
export const RIDE_ERROR_MESSAGES = {
  RIDE_NOT_FOUND: "Ride with ID {{rideId}} not found",
  RIDE_ALREADY_ACCEPTED: "Ride {{rideId}} has already been accepted",
  RIDE_ALREADY_STARTED: "Ride {{rideId}} has already been started",
  RIDE_ALREADY_COMPLETED: "Ride {{rideId}} has already been completed",
  RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has been cancelled",
  DRIVER_HAS_ACTIVE_RIDE:
    "Driver {{driverId}} already has an active ride: {{rideId}}",
  RIDER_HAS_ACTIVE_RIDE:
    "Rider {{riderId}} already has an active ride: {{rideId}}",
  INVALID_STATUS_TRANSITION:
    "Cannot transition ride {{rideId}} from {{from}} to {{to}}",
  RIDE_CREATION_FAILED: "Failed to create ride: {{reason}}",
  UNAUTHORIZED_RIDE_ACCESS: "You are not authorized to access ride {{rideId}}",
  CANNOT_MARK_AS_ARRIVED:
    "Cannot mark ride {{rideId}} as arrived from status {{currentStatus}}. Only accepted rides can be marked as arrived.",
  CANNOT_RATE_INCOMPLETE_RIDE:
    "Cannot rate ride {{rideId}} because it is not yet completed",
  RIDE_ALREADY_RATED: "Ride {{rideId}} has already been rated by you",
  DRIVER_NOT_FOUND_FOR_RIDE: "No driver found associated with ride {{rideId}}",
  INVALID_RATING_VALUE: "Rating values must be between 0.5 and 5",
  INVALID_RATING_DATA: "Invalid rating data provided: {{reason}}",
  RIDE_NOT_ELIGIBLE_FOR_COUPON:
    "Ride '{rideId}' with status {{currentStatus}} is not eligible for a coupon",
} as const;

export const RIDE_CANCELLATION_ERROR_MESSAGES = {
  RIDE_NOT_FOUND: "Ride with ID {{rideId}} was not found.",
  UNAUTHORIZED_CANCELLATION: "You are not authorized to cancel ride {rideId}.",
  RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has already been cancelled.",
  CANNOT_CANCEL_COMPLETED_RIDE:
    "Ride {{rideId}} cannot be cancelled because it has already been completed.",
  CANNOT_CANCEL_STARTED_RIDE:
    "Ride {{rideId}} cannot be cancelled after it has started.",
  CHARGE_CALCULATION_FAILED:
    "Failed to calculate the cancellation charge for ride {{rideId}}: {{reason}}.",
  FARE_RESET_FAILED:
    "Failed to reset fare breakdown for ride {rideId}: {reason}.",
  INVALID_CANCELLATION_REASON: "{{reason}} is not a valid cancellation reason.",
} as const;

export const DRIVER_RIDE_CANCELLATION_ERROR_MESSAGES = {
  RIDE_NOT_FOUND: "Ride with ID {{rideId}} was not found.",
  DRIVER_NOT_FOUND: "Driver with user ID {{userId}} was not found.",
  UNAUTHORIZED_CANCELLATION:
    "Driver {{driverId}} is not authorized to cancel ride {{rideId}}.",
  RIDE_ALREADY_CANCELLED: "Ride {{rideId}} has already been cancelled.",
  CANNOT_CANCEL_COMPLETED_RIDE:
    "Ride {{rideId}} cannot be cancelled because it has already been completed.",
  CHARGE_CALCULATION_FAILED:
    "Failed to calculate the cancellation outcome for ride {{rideId}}: {{reason}}.",
  FARE_RESET_FAILED:
    "Failed to reset fare breakdown for ride {{rideId}}: {{reason}}.",
  INVALID_CANCELLATION_REASON:
    "{{reason}} is not a valid driver cancellation reason.",
  WALLET_NOT_FOUND: "Wallet not found for driver {{driverId}}.",
} as const;
