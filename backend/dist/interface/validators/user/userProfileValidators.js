"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileValidation = exports.getUserProfileValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getUserProfileValidation = [
    (0, express_validator_1.param)("userId").isMongoId().withMessage("Invalid user ID format"),
];
exports.updateUserProfileValidation = [
    (0, express_validator_1.param)("userId").isMongoId().withMessage("Invalid user ID format"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Name can only contain letters and spaces"),
    (0, express_validator_1.body)("mobile")
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Please provide a valid 10-digit mobile number"),
    (0, express_validator_1.body)("dob")
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
    (0, express_validator_1.body)("gender")
        .optional()
        .isIn(["Male", "Female", "Other"])
        .withMessage("Gender must be Male, Female, or Other"),
    (0, express_validator_1.body)("address")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Address must be less than 500 characters"),
];
//# sourceMappingURL=userProfileValidators.js.map