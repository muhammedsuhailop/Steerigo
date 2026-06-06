export declare const RIDE_REQUEST_ERROR_MESSAGES: {
    readonly DRIVER_NOT_FOUND: "Driver with ID {{driverId}} not found";
    readonly RIDE_REQUEST_NOT_FOUND: "Ride Request with ID {{requestId}} is not available";
    readonly NO_PENDING_REQUEST_FOUND: "No Pending ride request found";
    readonly USER_NOT_FOUND: "User with ID {{userId}} not found";
    readonly INVALID_FARE: "Invalid fare amount: {{fare}}. Fare must be positive";
    readonly INVALID_PICKUP_TIME: "Invalid pickup time: {{pickupTime}}. Pickup time must be in the future";
    readonly INVALID_LOCATION: "Invalid {{fieldName}} location coordinates";
    readonly INVALID_RIDE_TYPE: "Invalid ride type: {{rideType}}. Must be \"One Way\" or \"Round Trip\"";
    readonly DRIVER_NOT_AVAILABLE: "Driver with ID {{driverId}} is not available";
    readonly DUPLICATE_RIDE_REQUEST: "Rider {{riderId}} already has a pending request to driver {{driverId}}";
    readonly REQUEST_DRIVER_MISMATCH: "The specified ride request is not assigned to the current driver {{driverId}}";
    readonly REQUEST_NOT_IN_PENDING: "The ride request cannot be processed because it is no longer in a pending state. requestId: {{requestId}} currentStatus: {{status}}";
    readonly RIDE_REQUEST_CREATION_FAILED: "Failed to create ride request{{reason}}";
    readonly RIDE_REQUEST_NOT_FOR_DRIVER: "Ride request {requestId} does not belong to driver {driverId}";
    readonly RIDE_REQUEST_NOT_PENDING: "Ride request {requestId} is not pending. Current status: {status}";
    readonly RIDE_REQUEST_ALREADY_PROCESSING: "Ride request {requestId} is currently being processed";
    readonly RIDE_REQUEST_ALREADY_ACCEPTED: "Ride request {requestId} has already been accepted";
    readonly RIDE_REQUEST_EXPIRED: "Ride request {requestId} has expired";
};
//# sourceMappingURL=RideRequestMessages.d.ts.map