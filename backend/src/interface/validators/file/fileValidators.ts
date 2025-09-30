import { body } from "express-validator";

export const uploadFileValidation = [
  body("purpose")
    .trim()
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn([
      "avatar",
      "licenseFront",
      "licenseBack",
      "insurance",
      "kycdocFront",
      "kycdocBack",
      "profile",
      "document",
    ])
    .withMessage(
      "Invalid purpose. Allowed values: avatar, licenseFront,licenseBack, insurance, kycdocFront, kycdocBack, profile, document"
    ),
];
