export const SOCKET_EVENTS = {
  RIDER: {
    MATCHED: "ride:matched",
    NO_DRIVER: "ride:no_driver_found",
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
