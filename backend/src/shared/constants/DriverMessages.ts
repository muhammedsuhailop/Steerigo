export const DRIVER_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  MISSING_FIELDS_PREFIX: "Missing required fields: ",
  DRIVER_REGISTRATION_SUCCESS:
    "Driver registration successful with profile update and KYC documents created",
  INTERNAL_SERVER_ERROR: "Internal server error",
  PROFILE_UPDATE_SUCCESS: "Driver profile updated successfully",
  KYC_SUBMIT_SUCCESS: "KYC document submitted successfully",
  KYC_STATUS_RETRIEVED: "KYC status retrieved successfully",
  STATUS_USERID_NOT_FOUND: "Unauthorized - User ID not found",
  DRIVER_STATUS_RETRIEVED: "Driver status retrieved successfully",
  DRIVER_DASHBOARD_RETURNED: "Driver dashboard returned successfully",
  DRIVER_DETAILED_PROFILE_FETCH_FAILED: "Driver profile fetch failed",
  DRIVER_DETAILED_PROFILE_RETURNED:
    "Driver detailed profile returned successfully",
  DRIVER_AUTH_REQUIRED: "Driver authentication required",
  AVAILABILITY_SCHEDULED: "Availability scheduled successfully",
  AVAILABILITY_STATUS_UPDATED: "Availability status updated successfully",
  DRIVER_LOCATION_UPDATED: "Driver location updated successfully",
  INVALID_MISSING_DOC_TYPE: "Invalid or missing document type",
  AVAILABILITY_EXCEPTION_UPDATED: "Availability Exception added successfully",
  AVAILABILITY_EXCEPTION_REMOVED: "Availability Exception removed successfully",
  REQUEST_ID_REQUIRED: "Request ID is required",
  RIDE_ID_REQUIRED: "Ride ID is required",
  PAYOUT_RETRIVED: "Payouts retrieved successfully.",
  PAYOUT_REQUEST_SUBMITTED:
    "Payout request submitted successfully. Awaiting admin approval.",
  WALLET_FETCHED: "Wallet details fetched successfully.",
};

export const DRIVER_ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  DRIVER_PROFILE_NOT_FOUND: "Driver profile not found",
  KYC_DOCUMENT_NOT_FOUND: "KYC document not found",
  RESOURCE_NOT_FOUND: "Resource not found",
  DRIVER_ACCESS_DENIED: "Access denied for driver",
} as const;

export const KYC_ERROR_MESSAGES = {
  KYC_NOT_FOUND: "KYC document not found",
  PROFILE_PICTURE_NOT_UPLOADED: "Profile picture is required for KYC approval",
  LICENSE_NOT_APPROVED:
    "Latest license must be approved before updating driver KYC status",
  NON_LICENSE_KYC_NOT_APPROVED:
    "At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved",
  INVALID_KYC_STATUS_TRANSITION: "Invalid KYC status transition",
} as const;

export const DRIVER_AVAILABILITY_ERROR_MESSAGES = {
  DRIVER_AVAILABILITY_NOT_FOUND: "Driver availability not found{{driverPart}}",
  INVALID_AVAILABILITY_SCHEDULE: "Invalid availability schedule: {{reason}}",
  DRIVER_ALREADY_AVAILABLE:
    "Driver {{driverId}} already has an active availability record",
  INVALID_STATUS_TRANSITION:
    "Cannot transition from {{currentStatus}} to {{newStatus}}",
  EXPIRED_AVAILABILITY:
    "Cannot perform operation on expired availability record",
  DRIVER_PROFILE_NOT_FOUND: "Driver profile not found for user ID: {{userId}}",
  AVAILABILITY_EXCEPTION_NOT_FOUND:
    "Availability Exception is not found for id : {{exceptionId}}",
} as const;

export const SEARCH_DRIVER_ERROR_MESSAGES = {
  NO_DRIVERS_AVAILABLE: "No drivers available in the specified area",
  INVALID_LOCATION: "Invalid location coordinates",
  INVALID_SEARCH_DATE: "Invalid search date provided",
  DRIVER_FILTER_NOT_MATCH: "No drivers match your vehicle type preferences",
  LOCATION_SERVICE_ERROR: "Error processing location",
} as const;
