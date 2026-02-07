export const RIDE_REQUEST_ERROR_MESSAGES = {
  DRIVER_NOT_FOUND: "Driver with ID {{driverId}} not found",
  RIDE_REQUEST_NOT_FOUND: "Ride Request with ID {{requestId}} is not available",
  USER_NOT_FOUND: "User with ID {{userId}} not found",
  INVALID_FARE: "Invalid fare amount: {{fare}}. Fare must be positive",
  INVALID_PICKUP_TIME:
    "Invalid pickup time: {{pickupTime}}. Pickup time must be in the future",
  INVALID_LOCATION: "Invalid {{fieldName}} location coordinates",
  INVALID_RIDE_TYPE:
    'Invalid ride type: {{rideType}}. Must be "One Way" or "Round Trip"',
  DRIVER_NOT_AVAILABLE: "Driver with ID {{driverId}} is not available",
  DUPLICATE_RIDE_REQUEST:
    "Rider {{riderId}} already has a pending request to driver {{driverId}}",
  REQUEST_DRIVER_MISMATCH:
    "The specified ride request is not assigned to the current driver {{driverId}}",
  REQUEST_NOT_IN_PENDING:
    "The ride request cannot be processed because it is no longer in a pending state. requestId: {{requestId}} currentStatus: {{status}}",
  RIDE_REQUEST_CREATION_FAILED: "Failed to create ride request{{reason}}",
  RIDE_REQUEST_NOT_FOR_DRIVER:
    "Ride request {requestId} does not belong to driver {driverId}",
  RIDE_REQUEST_NOT_PENDING:
    "Ride request {requestId} is not pending. Current status: {status}",
} as const;
