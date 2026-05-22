export const PUBSUB_CHANNELS = {
  RIDE_SEARCH_PROGRESS: "pubsub:ride:search:progress",
  RIDE_REQUEST_CREATED: "pubsub:ride:request:created",
  RIDE_REQUEST_EXPIRED: "pubsub:ride:request:expired",
  RIDE_NO_DRIVER_FOUND: "pubsub:ride:no-driver-found",
  FUTURE_RIDE_ALL_DRIVERS_REJECTED: "pubsub:future_ride:all_drivers_rejected",
} as const;
