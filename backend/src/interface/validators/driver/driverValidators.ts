import { body } from "express-validator";

export const registerDriverValidation = [
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

  body("pin").notEmpty().withMessage("PIN code is required"),

  body("address").notEmpty().withMessage("Address is required"),

  body("licenseNumber").notEmpty().withMessage("License Number is required"),

  body("vehicleTypes")
    .isArray({ min: 1 })
    .withMessage("Vehicle types must be a non-empty array"),

  body("gearTypes")
    .isArray({ min: 1 })
    .withMessage("Gear types must be a non-empty array"),

  body("licenseCategory")
    .notEmpty()
    .withMessage("License category is required"),

  body("licenseBodyTypes")
    .isArray({ min: 1 })
    .withMessage("License body types must be a non-empty array"),

  body("licenseGearTypes")
    .isArray({ min: 1 })
    .withMessage("License gear types must be a non-empty array"),

  body("idType")
    .isIn(["PAN", "Aadhaar", "DrivingLicense"])
    .withMessage("Invalid ID type"),

  body("idNumber").notEmpty().withMessage("ID number is required"),

  body("licenseFrontImage")
    .notEmpty()
    .withMessage("License front image is required"),

  body("licenseBackImage")
    .notEmpty()
    .withMessage("License back image is required"),

  body("idFrontImage").notEmpty().withMessage("ID front image is required"),

  body("idBackImage").notEmpty().withMessage("ID back image is required"),
];
