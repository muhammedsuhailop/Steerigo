"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriverValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerDriverValidation = [
    // Personal Information
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Full name must be at least 2 characters long"),
    (0, express_validator_1.body)("mobile").isMobilePhone("any").withMessage("Invalid mobile number"),
    (0, express_validator_1.body)("dob").isISO8601().withMessage("Invalid date of birth format"),
    (0, express_validator_1.body)("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["Male", "Female", "Other"])
        .withMessage("Gender must be Male, Female, or Other"),
    (0, express_validator_1.body)("state").notEmpty().withMessage("State is required"),
    (0, express_validator_1.body)("pin")
        .notEmpty()
        .withMessage("PIN code is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("PIN code must be 6 digits"),
    (0, express_validator_1.body)("address").notEmpty().withMessage("Address is required"),
    // Vehicle and License Information
    (0, express_validator_1.body)("bodyTypes")
        .isArray({ min: 1 })
        .withMessage("Vehicle types must be a non-empty array"),
    (0, express_validator_1.body)("gearTypes")
        .isArray({ min: 1 })
        .withMessage("Gear types must be a non-empty array"),
    (0, express_validator_1.body)("licenseNumber").notEmpty().withMessage("License Number is required"),
    (0, express_validator_1.body)("licenseCategory")
        .isArray({ min: 1 })
        .withMessage("License category must be a non-empty array"),
    (0, express_validator_1.body)("licenseIssueDate")
        .isISO8601()
        .withMessage("Invalid license issue date format"),
    (0, express_validator_1.body)("licenseExpiryDate")
        .isISO8601()
        .withMessage("Invalid license expiry date format"),
    // ID Information
    (0, express_validator_1.body)("idType")
        .isIn(["PAN", "Aadhaar", "DrivingLicense", "Passport"])
        .withMessage("Invalid ID type"),
    (0, express_validator_1.body)("idNumber").notEmpty().withMessage("ID number is required"),
    (0, express_validator_1.body)("idIssueDate").isISO8601().withMessage("Invalid ID issue date format"),
    (0, express_validator_1.body)("idExpiryDate").isISO8601().withMessage("Invalid ID expiry date format"),
    // Document Images
    (0, express_validator_1.body)("licenseFrontImage")
        .notEmpty()
        .withMessage("License front image is required"),
    (0, express_validator_1.body)("licenseBackImage")
        .notEmpty()
        .withMessage("License back image is required"),
    (0, express_validator_1.body)("idFrontImage").notEmpty().withMessage("ID front image is required"),
    (0, express_validator_1.body)("idBackImage").notEmpty().withMessage("ID back image is required"),
];
//# sourceMappingURL=driverValidators.js.map