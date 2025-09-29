import { body } from "express-validator";

export const uploadFileValidation = [
  body("purpose")
    .trim()
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn([
      "avatar",
      "license",
      "insurance",
      "kycdoc1",
      "kycdoc2",
      "profile",
      "document",
    ])
    .withMessage(
      "Invalid purpose. Allowed values: avatar, license, insurance, kycdoc1, kycdoc2, profile, document"
    ),
];
