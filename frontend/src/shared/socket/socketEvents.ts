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
  },
} as const;
