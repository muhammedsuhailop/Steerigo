export declare const USER_MESSAGES: {
    readonly PROFILE: {
        readonly UNAUTHORIZED: "Unauthorized";
        readonly ACCESS_DENIED_VIEW: "Access denied. You can only view your own profile.";
        readonly ACCESS_DENIED_UPDATE: "Access denied. You can only update your own profile.";
        readonly PROFILE_FETCHED: "User profile fetched successfully";
        readonly PROFILE_UPDATED: "User profile updated successfully";
        readonly ACCESS_DENIED_REGISTER_DRIVER: "Access denied. You can only register yourself as a driver.";
        readonly INTERNAL_SERVER_ERROR: "Internal server error";
        readonly STATS_FETCHED: "User stats fetched successfully.";
    };
    readonly DRIVER_SEARCH: {
        readonly UNAUTHORIZED: "Unauthorized: User not authenticated";
        readonly INVALID_INPUT: "Invalid search parameters";
        readonly NO_DRIVERS_FOUND: "No available drivers found for the given criteria";
        readonly FOUND_DRIVERS: (count: number) => string;
        readonly INTERNAL_SERVER_ERROR: "An internal server error occurred while searching for drivers";
        readonly SEARCH_FAILED: "Failed to find nearby drivers";
        readonly CANCELLED_SUCCESS: "Ride requests cancelled successfully";
        readonly SCHEDULE_CANCELLED: "Your scheduled ride has been successfully cancelled.";
    };
    readonly RIDE: {
        readonly UNAUTHORIZED: "You are not authorized to access this ride";
        readonly RIDE_ID_REQUIRED: "Ride ID is required";
    };
    readonly COUPON: {
        readonly FETCHED: "Coupons fetched successfully";
    };
};
//# sourceMappingURL=UserMessages.d.ts.map