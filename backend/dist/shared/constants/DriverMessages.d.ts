export declare const DRIVER_MESSAGES: {
    UNAUTHORIZED: string;
    MISSING_FIELDS_PREFIX: string;
    DRIVER_REGISTRATION_SUCCESS: string;
    INTERNAL_SERVER_ERROR: string;
    PROFILE_UPDATE_SUCCESS: string;
    KYC_SUBMIT_SUCCESS: string;
    KYC_STATUS_RETRIEVED: string;
    STATUS_USERID_NOT_FOUND: string;
    DRIVER_STATUS_RETRIEVED: string;
    DRIVER_DASHBOARD_RETURNED: string;
    DRIVER_DETAILED_PROFILE_FETCH_FAILED: string;
    DRIVER_DETAILED_PROFILE_RETURNED: string;
    DRIVER_AUTH_REQUIRED: string;
    AVAILABILITY_SCHEDULED: string;
    AVAILABILITY_STATUS_UPDATED: string;
    DRIVER_LOCATION_UPDATED: string;
    INVALID_MISSING_DOC_TYPE: string;
    AVAILABILITY_EXCEPTION_UPDATED: string;
    AVAILABILITY_EXCEPTION_REMOVED: string;
    REQUEST_ID_REQUIRED: string;
    RIDE_ID_REQUIRED: string;
    PAYOUT_RETRIVED: string;
    PAYOUT_REQUEST_SUBMITTED: string;
    WALLET_FETCHED: string;
    STATS_FETCHED: string;
    DRIVER_BASE_LOCATION_UPDATED: string;
    EXCEPTION_ADDED: string;
    DASHBOARD_DATA_RETRIEVED: string;
};
export declare const DRIVER_ERROR_MESSAGES: {
    readonly USER_NOT_FOUND: "User not found";
    readonly DRIVER_PROFILE_NOT_FOUND: "Driver profile not found";
    readonly KYC_DOCUMENT_NOT_FOUND: "KYC document not found";
    readonly RESOURCE_NOT_FOUND: "Resource not found";
    readonly DRIVER_ACCESS_DENIED: "Access denied for driver";
};
export declare const KYC_ERROR_MESSAGES: {
    readonly KYC_NOT_FOUND: "KYC document not found";
    readonly PROFILE_PICTURE_NOT_UPLOADED: "Profile picture is required for KYC approval";
    readonly LICENSE_NOT_APPROVED: "Latest license must be approved before updating driver KYC status";
    readonly NON_LICENSE_KYC_NOT_APPROVED: "At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved";
    readonly INVALID_KYC_STATUS_TRANSITION: "Invalid KYC status transition";
};
export declare const DRIVER_AVAILABILITY_ERROR_MESSAGES: {
    readonly DRIVER_AVAILABILITY_NOT_FOUND: "Driver availability not found{{driverPart}}";
    readonly INVALID_AVAILABILITY_SCHEDULE: "Invalid availability schedule: {{reason}}";
    readonly DRIVER_ALREADY_AVAILABLE: "Driver {{driverId}} already has an active availability record";
    readonly INVALID_STATUS_TRANSITION: "Cannot transition from {{currentStatus}} to {{newStatus}}";
    readonly EXPIRED_AVAILABILITY: "Cannot perform operation on expired availability record";
    readonly DRIVER_PROFILE_NOT_FOUND: "Driver profile not found for user ID: {{userId}}";
    readonly AVAILABILITY_EXCEPTION_NOT_FOUND: "Availability Exception is not found for id : {{exceptionId}}";
};
export declare const SEARCH_DRIVER_ERROR_MESSAGES: {
    readonly NO_DRIVERS_AVAILABLE: "No drivers available in the specified area";
    readonly INVALID_LOCATION: "Invalid location coordinates";
    readonly INVALID_SEARCH_DATE: "Invalid search date provided";
    readonly DRIVER_FILTER_NOT_MATCH: "No drivers match your vehicle type preferences";
    readonly LOCATION_SERVICE_ERROR: "Error processing location";
};
//# sourceMappingURL=DriverMessages.d.ts.map