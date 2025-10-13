import { body, query, param } from "express-validator";
import { FilePurpose } from "@domain/value-objects/FilePurpose";

export const uploadFileValidation = [
  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .custom((value) => {
      try {
        FilePurpose.create(value);
        return true;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }),
];

export const fileListValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Page size must be between 1 and 50"),

  query("purpose")
    .optional()
    .custom((value) => {
      if (value) {
        try {
          FilePurpose.create(value);
          return true;
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
      return true;
    }),

  query("search")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),

  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("dateFrom must be a valid ISO 8601 date"),

  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("dateTo must be a valid ISO 8601 date"),
];

export const deleteFileValidation = [
  param("fileId")
    .notEmpty()
    .withMessage("File ID is required")
    .isUUID()
    .withMessage("File ID must be a valid UUID"),
];
