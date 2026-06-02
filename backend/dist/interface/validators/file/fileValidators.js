"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileValidation = exports.fileListValidation = exports.uploadFileValidation = void 0;
const express_validator_1 = require("express-validator");
const FilePurpose_1 = require("@domain/value-objects/FilePurpose");
exports.uploadFileValidation = [
    (0, express_validator_1.body)("purpose")
        .notEmpty()
        .withMessage("Purpose is required")
        .custom((value) => {
        try {
            FilePurpose_1.FilePurpose.create(value);
            return true;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
];
exports.fileListValidation = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("pageSize")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Page size must be between 1 and 50"),
    (0, express_validator_1.query)("purpose")
        .optional()
        .custom((value) => {
        if (value) {
            try {
                FilePurpose_1.FilePurpose.create(value);
                return true;
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
        return true;
    }),
    (0, express_validator_1.query)("search")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Search term cannot exceed 100 characters"),
    (0, express_validator_1.query)("dateFrom")
        .optional()
        .isISO8601()
        .withMessage("dateFrom must be a valid ISO 8601 date"),
    (0, express_validator_1.query)("dateTo")
        .optional()
        .isISO8601()
        .withMessage("dateTo must be a valid ISO 8601 date"),
];
exports.deleteFileValidation = [
    (0, express_validator_1.param)("fileId")
        .notEmpty()
        .withMessage("File ID is required")
        .isUUID()
        .withMessage("File ID must be a valid UUID"),
];
//# sourceMappingURL=fileValidators.js.map