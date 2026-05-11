export const FUTURE_RIDE_ERROR_MESSAGES = {
  NO_DRIVERS_FOUND:
    "No drivers available near your pickup area for the scheduled time.",
  REQUEST_GROUP_NOT_FOUND:
    "Scheduled ride request group '{requestGroupId}' not found.",
  UNAUTHORIZED_CANCELLATION:
    "You are not authorized to cancel ride group '{requestGroupId}'.",
  CANNOT_CANCEL:
    "Ride group '{requestGroupId}' cannot be cancelled. Current status: {status}.",
  PICKUP_TIME_TOO_SOON: "Pickup time must be at least 6 hours from now.",
  INVALID_PICKUP_TIME: "Invalid pickup time provided.",
  SCHEDULE_FAILED: "Failed to schedule future ride request.",
} as const;

export const FUTURE_RIDE_SUCCESS_MESSAGES = {
  SCHEDULED: "Your ride has been scheduled. Drivers have been notified.",
  CANCELLED: "Your scheduled ride has been successfully cancelled.",
} as const;
