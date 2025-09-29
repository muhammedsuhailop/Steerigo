import { body } from "express-validator";

export const registerDriverValidation = [
  // Personal Information
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  body("mobile").isMobilePhone("any").withMessage("Invalid mobile number"),
  body("dob").isISO8601().withMessage("Invalid date of birth format"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("state").notEmpty().withMessage("State is required"),
  body("pin")
    .notEmpty()
    .withMessage("PIN code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("PIN code must be 6 digits"),
  body("address").notEmpty().withMessage("Address is required"),

  // Vehicle and License Information
  body("bodyTypes")
    .isArray({ min: 1 })
    .withMessage("Vehicle types must be a non-empty array"),
  body("gearTypes")
    .isArray({ min: 1 })
    .withMessage("Gear types must be a non-empty array"),
  body("licenseNumber").notEmpty().withMessage("License Number is required"),
  body("licenseCategory")
    .isArray({ min: 1 })
    .withMessage("License category must be a non-empty array"),
  body("licenseIssueDate")
    .isISO8601()
    .withMessage("Invalid license issue date format"),
  body("licenseExpiryDate")
    .isISO8601()
    .withMessage("Invalid license expiry date format"),

  // ID Information
  body("idType")
    .isIn(["PAN", "Aadhaar", "DrivingLicense"])
    .withMessage("Invalid ID type"),
  body("idNumber").notEmpty().withMessage("ID number is required"),
  body("idIssueDate").isISO8601().withMessage("Invalid ID issue date format"),
  body("idExpiryDate").isISO8601().withMessage("Invalid ID expiry date format"),

  // Document Images
  body("licenseFrontImage")
    .notEmpty()
    .withMessage("License front image is required"),
  body("licenseBackImage")
    .notEmpty()
    .withMessage("License back image is required"),
  body("idFrontImage").notEmpty().withMessage("ID front image is required"),
  body("idBackImage").notEmpty().withMessage("ID back image is required"),
];
