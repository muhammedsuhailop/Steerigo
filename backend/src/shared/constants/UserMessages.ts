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
} as const;
