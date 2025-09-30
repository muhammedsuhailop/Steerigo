import { body, query, param } from "express-validator";

export const getDriversValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["Active", "Blocked", "InReview", "Pending", "Verified", "Rejected"])
    .withMessage("Invalid status value"),
  query("kycStatus")
    .optional()
    .isIn(["Pending", "Verified", "Rejected"])
    .withMessage("Invalid KYC status value"),
  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for dateFrom"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for dateTo"),
  query("sortBy")
    .optional()
    .isIn([
      "name",
      "email",
      "totalRides",
      "totalEarned",
      "createdAt",
      "lastRide",
      "status",
      "kycStatus",
    ])
    .withMessage("Invalid sortBy field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
];

export const driverActionValidation = [
  param("driverId")
    .isMongoId()
    .withMessage("Driver ID must be a valid MongoDB ObjectId"),
  body("action")
    .isIn(["block", "unblock"])
    .withMessage("Action must be either block or unblock"),
];

export const getKycRequestsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Page size must be between 1 and 50"),
  query("docType")
    .optional()
    .isIn(["PAN", "Aadhaar", "DrivingLicense", "Passport"])
    .withMessage(
      "Document type must be PAN, Aadhaar, DrivingLicense, or Passport"
    ),
  query("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Date from must be a valid ISO date"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Date to must be a valid ISO date"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "docType", "isVerified", "expiryDate"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const getDriverProfileValidation = [
  param("driverId")
    .isMongoId()
    .withMessage("Driver ID must be a valid MongoDB ObjectId"),
];

export const updateKycStatusValidation = [
  param("driverId")
    .isMongoId()
    .withMessage("Driver ID must be a valid MongoDB ObjectId"),
  body("kycStatus")
    .isIn(["Approved", "Rejected"])
    .withMessage("KYC status must be either Approved or Rejected"),
  body("section")
    .isIn(["licenseEligibility", "documentVerification", "backgroundCheck"])
    .withMessage(
      "Section must be licenseEligibility, documentVerification, or backgroundCheck"
    ),
  body("comments")
    .optional()
    .isLength({ min: 0, max: 500 })
    .withMessage("Comments must not exceed 500 characters"),
];
