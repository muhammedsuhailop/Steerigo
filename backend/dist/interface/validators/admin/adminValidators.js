"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatusValidation = exports.getUsersValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getUsersValidation = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("pageSize")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Page size must be between 1 and 100"),
    (0, express_validator_1.query)("status")
        .optional()
        .isIn(["Active", "Suspended", "Pending Verification", "Inactive", "Blocked"])
        .withMessage("Invalid status value"),
    (0, express_validator_1.query)("search")
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage("Search term must be between 1 and 100 characters"),
    (0, express_validator_1.query)("dateFrom")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format for dateFrom"),
    (0, express_validator_1.query)("dateTo")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format for dateTo"),
];
exports.updateUserStatusValidation = [
    (0, express_validator_1.body)("action")
        .isIn(["activate", "suspend", "deactivate", "verify", "block"])
        .withMessage("Action must be one of: activate, suspend, deactivate, verify, block"),
];
//# sourceMappingURL=adminValidators.js.map