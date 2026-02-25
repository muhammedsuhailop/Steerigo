export const SOCKET_EVENTS = {
  RIDER: {
    MATCHED: "ride:matched",
    NO_DRIVER: "ride:no_driver_found",
  },
  DRIVER: {
    NEW_REQUEST: "ride_request:created",
    CANCELLED: "ride_request:cancelled",
  },
} as const;
