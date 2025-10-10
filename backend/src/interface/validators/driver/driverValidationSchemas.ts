import { z } from "zod";
import {
  LicenseCategory,
  VALID_LICENSE_CATEGORIES,
} from "@domain/value-objects/LicenseCategory";
import {
  GearType,
  BodyType,
  VALID_GEAR_TYPES,
  VALID_BODY_TYPES,
} from "@domain/value-objects/VehicleType";
import {
  DocumentType,
  VALID_DOC_TYPES,
} from "@domain/value-objects/DocumentType";

// Enhanced driver registration schema to handle comprehensive data
const driverRegistrationBodySchema = z.object({
  // User profile data
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{10,14}$/, { message: "Invalid mobile number format" }),
  dob: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), {
      message: "Driver must be at least 18 years old",
    })
  ),
  gender: z.enum(["Male", "Female", "Other"]),
  state: z.string().trim().min(1, { message: "State is required" }),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "PIN code must be 6 digits" }),
  address: z
    .string()
    .trim()
    .min(10, { message: "Address must be at least 10 characters" })
    .max(500, { message: "Address must be less than 500 characters" }),

  // Vehicle eligibility (derived from license info)
  vehicleTypes: z
    .array(z.string())
    .min(1, { message: "At least one vehicle type must be selected" })
    .optional(),
  gearTypes: z
    .array(z.string())
    .min(1, { message: "At least one gear type must be selected" })
    .optional(),

  // License information for Driver entity
  licenseCategory: z.enum(
    VALID_LICENSE_CATEGORIES as [LicenseCategory, ...LicenseCategory[]]
  ),
  licenseNumber: z
    .string()
    .trim()
    .min(5, { message: "License number must be at least 5 characters" })
    .max(20, { message: "License number must not exceed 20 characters" }),
  licenseBodyTypes: z
    .array(z.enum(VALID_BODY_TYPES as [BodyType, ...BodyType[]]))
    .min(1, { message: "At least one body type must be selected" }),
  licenseGearTypes: z
    .array(z.enum(VALID_GEAR_TYPES as [GearType, ...GearType[]]))
    .min(1, { message: "At least one gear type must be selected" }),
  licenseIssueDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().max(new Date(), {
      message: "License issue date cannot be in the future",
    })
  ),
  licenseExpiryDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().refine((d) => d > new Date(), {
      message: "License expiry date must be in the future",
    })
  ),

  // ID document information for KYC
  idType: z.enum(VALID_DOC_TYPES as [DocumentType, ...DocumentType[]]),
  idNumber: z
    .string()
    .trim()
    .min(5, { message: "ID number must be at least 5 characters" })
    .max(50, { message: "ID number must not exceed 50 characters" }),
  idIssueDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().max(new Date(), {
      message: "ID issue date cannot be in the future",
    })
  ),
  idExpiryDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().refine((d) => d > new Date(), {
      message: "ID expiry date must be in the future",
    })
  ),

  // Document images
  licenseFrontImage: z
    .string()
    .url({ message: "License front image must be a valid URL" }),
  licenseBackImage: z
    .string()
    .url({ message: "License back image must be a valid URL" }),
  idFrontImage: z
    .string()
    .url({ message: "ID front image must be a valid URL" }),
  idBackImage: z.string().url({ message: "ID back image must be a valid URL" }),
});

export const driverRegistrationSchema = z.object({
  body: driverRegistrationBodySchema,
});

// Keep existing update and KYC schemas unchanged
export const driverUpdateSchema = z.object({
  eligibleGearTypes: z
    .array(z.enum(VALID_GEAR_TYPES as [GearType, ...GearType[]]))
    .min(1, { message: "At least one gear type must be selected" })
    .optional(),
  eligibleBodyTypes: z
    .array(z.enum(VALID_BODY_TYPES as [BodyType, ...BodyType[]]))
    .min(1, { message: "At least one body type must be selected" })
    .optional(),
  licenceCategory: z
    .enum(VALID_LICENSE_CATEGORIES as [LicenseCategory, ...LicenseCategory[]])
    .optional(),
  licenseIssueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date().max(new Date(), {
        message: "License issue date cannot be in the future",
      })
    )
    .optional(),
  licenseExpiryDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .refine((d) => d > new Date(), {
      message: "License expiry date must be in the future",
    })
    .optional(),
});

export const kycSubmissionSchema = z.object({
  docType: z.enum(VALID_DOC_TYPES as [DocumentType, ...DocumentType[]]),
  docNumber: z
    .string()
    .trim()
    .min(5, { message: "Document number must be at least 5 characters" })
    .max(50, { message: "Document number must not exceed 50 characters" }),
  issueDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .refine((d) => d > new Date(), {
      message: "Expiry date must be in the future",
    })
    .optional(),
  expiryDate: z
    .preprocess(
      (arg) =>
        typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .refine((d) => d > new Date(), {
      message: "Expiry date must be in the future",
    })
    .optional(),
  frontImageUrls: z
    .array(z.string().url())
    .min(1, { message: "At least one front image is required" }),
  backImageUrls: z
    .array(z.string().url())
    .min(1, { message: "At least one back image is required" }),
});
