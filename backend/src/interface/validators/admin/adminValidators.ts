import { body, query } from "express-validator";

export const getUsersValidation = [
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
    .isIn(["Active", "Suspended", "Pending Verification", "Inactive"])
    .withMessage("Invalid status value"),

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
];

export const updateUserStatusValidation = [
  body("action")
    .isIn(["activate", "suspend", "deactivate", "verify", "block"])
    .withMessage(
      "Action must be one of: activate, suspend, deactivate, verify, block"
    ),
];
