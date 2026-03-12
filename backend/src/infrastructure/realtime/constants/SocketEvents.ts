export const SOCKET_EVENTS = {
  DRIVER_LOCATION_UPDATE: "driver:location:update",
  DRIVER_LOCATION: "driver:location",
  RIDE_DRIVER_LOCATION: "ride:driver-location",

  RIDE_JOIN: "ride:join",
  RIDE_LEAVE: "ride:leave",

  AUTH_LOGOUT: "auth:logout",

  RIDE_ARRIVED: "ride:arrived",
  RIDE_STARTED: "ride:started",
  RIDE_COMPLETED: "ride:completed",
} as const;

export type SocketEventKey = keyof typeof SOCKET_EVENTS;
export type SocketEventValue = (typeof SOCKET_EVENTS)[SocketEventKey];
