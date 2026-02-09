export const RIDE_MESSAGES = {
  RIDE_REQUEST_ACCEPTED: "Ride request accepted successfully",
  RIDE_REQUEST_REJECTED: "Ride request rejected successfully",
  PENDING_REQUESTS_FETCHED: "Pending ride requests fetched successfully",
  RIDES_FETCHED_SUCCESSFULLY: "Rides fetched successfully ",
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
} as const;
