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
    STATUS_UPDATED: "",
  },
} as const;
