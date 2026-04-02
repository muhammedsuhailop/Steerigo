export const SOCKET_EVENTS = {
  DRIVER_REQUEST_CREATED: "ride:request:created",
  DRIVER_REQUEST_CANCELLED: "ride:request:cancelled",
  DRIVER_LOCATION_UPDATE: "driver:location:update",
  DRIVER_LOCATION: "driver:location",
  RIDE_DRIVER_LOCATION: "ride:driver-location",

  RIDE_MATCHED: "ride:matched",
  RIDE_JOIN: "ride:join",
  RIDE_LEAVE: "ride:leave",
  RIDE_NO_DRIVER_FOUND: "ride:no-driver-found",

  RIDE_CANCELLED_RIDER: "ride:cancelled:rider",
  RIDE_CANCELLED_DRIVER: "ride:cancelled:driver",

  RIDE_CANCELLED_BY_DRIVER_TO_RIDER: "ride:cancelled:by_driver:to_rider",
  RIDE_CANCELLED_BY_DRIVER_TO_DRIVER: "ride:cancelled:by_driver:to_driver",

  RIDE_FARE_RECALCULATED: "ride:fare_recalculated",

  AUTH_LOGOUT: "auth:logout",

  RIDE_ARRIVED: "ride:arrived",
  RIDE_STARTED: "ride:started",
  RIDE_COMPLETED: "ride:completed",

  PAYMENT_INITIATED: "payment:initiated",
  PAYMENT_COMPLETED: "payment:succeeded",
  PAYMENT_FAILED: "payment:failed",
  PAYMENT_CASH_CONFIRMED: "cash-confirmed",

  NOTIFICATION_CREATED: "notification:created",
} as const;

export type SocketEventKey = keyof typeof SOCKET_EVENTS;
export type SocketEventValue = (typeof SOCKET_EVENTS)[SocketEventKey];
