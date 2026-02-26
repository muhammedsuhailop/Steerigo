export const USER_MESSAGES = {
  PROFILE: {
    UNAUTHORIZED: "Unauthorized",
    ACCESS_DENIED_VIEW: "Access denied. You can only view your own profile.",
    ACCESS_DENIED_UPDATE:
      "Access denied. You can only update your own profile.",
    PROFILE_FETCHED: "User profile fetched successfully",
    PROFILE_UPDATED: "User profile updated successfully",
    ACCESS_DENIED_REGISTER_DRIVER:
      "Access denied. You can only register yourself as a driver.",
    INTERNAL_SERVER_ERROR: "Internal server error",
  },
  DRIVER_SEARCH: {
    UNAUTHORIZED: "Unauthorized: User not authenticated",
    INVALID_INPUT: "Invalid search parameters",
    NO_DRIVERS_FOUND: "No available drivers found for the given criteria",
    FOUND_DRIVERS: (count: number) => `Found ${count} available drivers`,
    INTERNAL_SERVER_ERROR:
      "An internal server error occurred while searching for drivers",
    SEARCH_FAILED: "Failed to find nearby drivers",
    CANCELLED_SUCCESS: "Ride requests cancelled successfully",
  },
  RIDE: {
    UNAUTHORIZED: "You are not authorized to access this ride",
  },
} as const;
