import { body, param } from "express-validator";

export const getUserProfileValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),
];

export const updateUserProfileValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("mobile")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid 10-digit mobile number"),

  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (age < 10) {
        throw new Error("Must be at least 10 years old");
      }
      if (age > 100) {
        throw new Error("Please provide a valid date of birth");
      }
      return true;
    }),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Address must be less than 500 characters"),
];
