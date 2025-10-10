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

const driverRegistrationBodySchema = z.object({
  eligibleGearTypes: z
    .array(z.enum(VALID_GEAR_TYPES as [GearType, ...GearType[]]))
    .min(1, { message: "At least one gear type must be selected" }),
  eligibleBodyTypes: z
    .array(z.enum(VALID_BODY_TYPES as [BodyType, ...BodyType[]]))
    .min(1, { message: "At least one body type must be selected" }),
  licenceCategory: z.enum(
    VALID_LICENSE_CATEGORIES as [LicenseCategory, ...LicenseCategory[]]
  ),
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
});

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
      z
        .date()
        .max(new Date(), {
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

export const driverRegistrationSchema = z.object({
  body: driverRegistrationBodySchema,
});