"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycSubmissionSchema = exports.driverUpdateSchema = exports.driverRegistrationSchema = void 0;
const zod_1 = require("zod");
const LicenseCategory_1 = require("../../../domain/value-objects/LicenseCategory");
const VehicleType_1 = require("../../../domain/value-objects/VehicleType");
const DocumentType_1 = require("../../../domain/value-objects/DocumentType");
const Gender_1 = require("../../../domain/value-objects/Gender");
const driverRegistrationBodySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name must be less than 100 characters" }),
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\+?\d{10,15}$/, { message: "Invalid mobile number format" }),
    dob: zod_1.z.preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), {
        message: "Driver must be at least 18 years old",
    })),
    gender: zod_1.z.nativeEnum(Gender_1.Gender),
    state: zod_1.z.string().trim().min(1, { message: "State is required" }),
    pin: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, { message: "PIN code must be 6 digits" }),
    address: zod_1.z
        .string()
        .trim()
        .min(10, { message: "Address must be at least 10 characters" })
        .max(500, { message: "Address must be less than 500 characters" }),
    licenseCategory: zod_1.z.enum(LicenseCategory_1.VALID_LICENSE_CATEGORIES),
    licenseNumber: zod_1.z
        .string()
        .trim()
        .min(5, { message: "License number must be at least 5 characters" })
        .max(20, { message: "License number must not exceed 20 characters" }),
    licenseBodyTypes: zod_1.z
        .array(zod_1.z.enum(VehicleType_1.VALID_BODY_TYPES))
        .min(1, { message: "At least one body type must be selected" }),
    licenseGearTypes: zod_1.z
        .array(zod_1.z.enum(VehicleType_1.VALID_GEAR_TYPES))
        .min(1, { message: "At least one gear type must be selected" }),
    licenseIssueDate: zod_1.z.preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(), {
        message: "License issue date cannot be in the future",
    })),
    licenseExpiryDate: zod_1.z.preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().refine((d) => d > new Date(), {
        message: "License expiry date must be in the future",
    })),
    idType: zod_1.z.enum(DocumentType_1.VALID_DOC_TYPES),
    idNumber: zod_1.z
        .string()
        .trim()
        .min(5, { message: "ID number must be at least 5 characters" })
        .max(50, { message: "ID number must not exceed 50 characters" }),
    idIssueDate: zod_1.z.preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(), {
        message: "ID issue date cannot be in the future",
    })),
    idExpiryDate: zod_1.z.preprocess((arg) => {
        if (typeof arg === "string" && arg.trim() === "") {
            return undefined;
        }
        if (typeof arg === "string" || arg instanceof Date) {
            return new Date(arg);
        }
        return arg;
    }, zod_1.z
        .date()
        .refine((d) => d > new Date(), {
        message: "ID expiry date must be in the future",
    })
        .optional()),
    licenseFrontImage: zod_1.z.string(),
    licenseBackImage: zod_1.z.string(),
    idFrontImage: zod_1.z.string(),
    idBackImage: zod_1.z.string(),
});
exports.driverRegistrationSchema = zod_1.z.object({
    body: driverRegistrationBodySchema,
});
const driverUpdateBodySchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name must be less than 100 characters" })
        .optional(),
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\+?\d{10,15}$/, { message: "Invalid mobile number format" }),
    dob: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), {
        message: "Driver must be at least 18 years old",
    }))
        .optional(),
    gender: zod_1.z.nativeEnum(Gender_1.Gender).optional(),
    state: zod_1.z
        .string()
        .trim()
        .min(1, { message: "State is required" })
        .optional(),
    pin: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, { message: "PIN code must be 6 digits" })
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .min(10, { message: "Address must be at least 10 characters" })
        .max(500, { message: "Address must be less than 500 characters" })
        .optional(),
    eligibleGearTypes: zod_1.z
        .array(zod_1.z.enum(VehicleType_1.VALID_GEAR_TYPES))
        .min(1, { message: "At least one gear type must be selected" })
        .optional(),
    eligibleBodyTypes: zod_1.z
        .array(zod_1.z.enum(VehicleType_1.VALID_BODY_TYPES))
        .min(1, { message: "At least one body type must be selected" })
        .optional(),
    licenceCategory: zod_1.z
        .enum(LicenseCategory_1.VALID_LICENSE_CATEGORIES)
        .optional(),
    licenseNumber: zod_1.z
        .string()
        .trim()
        .min(5, { message: "License number must be at least 5 characters" })
        .max(20, { message: "License number must not exceed 20 characters" })
        .optional(),
    licenseIssueDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(), {
        message: "License issue date cannot be in the future",
    }))
        .optional(),
    licenseExpiryDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().refine((d) => d > new Date(), {
        message: "License expiry date must be in the future",
    }))
        .optional(),
    idType: zod_1.z
        .enum(DocumentType_1.VALID_DOC_TYPES)
        .optional(),
    idNumber: zod_1.z
        .string()
        .trim()
        .min(5, { message: "ID number must be at least 5 characters" })
        .max(50, { message: "ID number must not exceed 50 characters" })
        .optional(),
    idIssueDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().max(new Date(), {
        message: "ID issue date cannot be in the future",
    }))
        .optional(),
    idExpiryDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date().refine((d) => d > new Date(), {
        message: "ID expiry date must be in the future",
    }))
        .optional(),
    licenseFrontImage: zod_1.z.string().optional(),
    licenseBackImage: zod_1.z.string().optional(),
    idFrontImage: zod_1.z.string().optional(),
    idBackImage: zod_1.z.string().optional(),
})
    .refine((data) => {
    return Object.values(data).some((value) => value !== undefined);
}, { message: "At least one field must be provided for update" });
exports.driverUpdateSchema = zod_1.z.object({
    body: driverUpdateBodySchema,
});
const kycSubmissionBodySchema = zod_1.z.object({
    docType: zod_1.z.enum(DocumentType_1.VALID_DOC_TYPES),
    docNumber: zod_1.z
        .string()
        .trim()
        .min(5, { message: "Document number must be at least 5 characters" })
        .max(50, { message: "Document number must not exceed 50 characters" }),
    issueDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date())
        .refine((d) => d <= new Date(), {
        message: "Issue date must be in the past or today",
    }),
    expiryDate: zod_1.z
        .preprocess((arg) => typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg, zod_1.z.date())
        .refine((d) => d > new Date(), {
        message: "Expiry date must be in the future",
    })
        .optional()
        .nullable(),
    frontImageUrls: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one front image URL is required" })
        .refine((urls) => urls.length > 0, {
        message: "Front images cannot be empty",
    }),
    backImageUrls: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one back image URL is required" })
        .refine((urls) => urls.length > 0, {
        message: "Back images cannot be empty",
    }),
});
exports.kycSubmissionSchema = zod_1.z.object({
    body: kycSubmissionBodySchema,
});
//# sourceMappingURL=driverValidationSchemas.js.map