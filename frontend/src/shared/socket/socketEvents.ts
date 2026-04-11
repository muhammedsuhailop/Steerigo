export const SOCKET_EVENTS = {
  RIDER: {
    MATCHED: "ride:matched",
    NO_DRIVER: "ride:no-driver-found",
  },
  DRIVER: {
    NEW_REQUEST: "ride:request:created",
    CANCELLED: "ride:request:cancelled",
  },
  RIDE: {
    JOIN: "ride:join",
    LEAVE: "ride:leave",

    UPDATE_LOCATION: "driver:location:update",
    DRIVER_LOCATION: "ride:driver-location",
    STATUS_UPDATED: "ride:status:updated",
    ARRIVED: "ride:arrived",
    STARTED: "ride:started",
    COMPLETED: "ride:completed",

    RIDE_CANCELLED_RIDER: "ride:cancelled:rider",

    RIDE_CANCELLED_DRIVER: "ride:cancelled:driver",

    RIDE_CANCELLED_BY_DRIVER_TO_RIDER: "ride:cancelled:by_driver:to_rider",

    RIDE_CANCELLED_BY_DRIVER_TO_DRIVER: "ride:cancelled:by_driver:to_driver",

    RIDE_FARE_RECALCULATED: "ride:fare_recalculated",

    RIDE_SEARCH_PROGRESS_UPDATED: "ride:search:progress-updated",
  },
  PAYMENT: {
    PAYMENT_INITIATED: "payment:initiated",
    PAYMENT_COMPLETED: "payment:succeeded",
    PAYMENT_FAILED: "payment:failed",
    PAYMENT_CASH_CONFIRMED: "cash-confirmed",
  },
  NOTIFICATION: {
    CREATED: "notification:created",
  },
} as const;
