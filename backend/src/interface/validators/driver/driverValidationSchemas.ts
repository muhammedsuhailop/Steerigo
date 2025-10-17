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
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be less than 100 characters" }),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: "Invalid mobile number format" }),
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
    (arg) => {
      if (typeof arg === "string" && arg.trim() === "") {
        return undefined;
      }
      if (typeof arg === "string" || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    },
    z
      .date()
      .refine((d) => d > new Date(), {
        message: "ID expiry date must be in the future",
      })
      .optional()
  ),

  licenseFrontImage: z.string(),
  licenseBackImage: z.string(),
  idFrontImage: z.string(),
  idBackImage: z.string(),
});

export const driverRegistrationSchema = z.object({
  body: driverRegistrationBodySchema,
});

const driverUpdateBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(100, { message: "Name must be less than 100 characters" })
      .optional(),
    mobile: z
      .string()
      .trim()
      .regex(/^\+?[1-9]\d{10,14}$/, { message: "Invalid mobile number format" })
      .optional(),
    dob: z
      .preprocess(
        (arg) =>
          typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
        z.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), {
          message: "Driver must be at least 18 years old",
        })
      )
      .optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    state: z
      .string()
      .trim()
      .min(1, { message: "State is required" })
      .optional(),
    pin: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "PIN code must be 6 digits" })
      .optional(),
    address: z
      .string()
      .trim()
      .min(10, { message: "Address must be at least 10 characters" })
      .max(500, { message: "Address must be less than 500 characters" })
      .optional(),

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
    licenseNumber: z
      .string()
      .trim()
      .min(5, { message: "License number must be at least 5 characters" })
      .max(20, { message: "License number must not exceed 20 characters" })
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
        z.date().refine((d) => d > new Date(), {
          message: "License expiry date must be in the future",
        })
      )
      .optional(),

    idType: z
      .enum(VALID_DOC_TYPES as [DocumentType, ...DocumentType[]])
      .optional(),
    idNumber: z
      .string()
      .trim()
      .min(5, { message: "ID number must be at least 5 characters" })
      .max(50, { message: "ID number must not exceed 50 characters" })
      .optional(),
    idIssueDate: z
      .preprocess(
        (arg) =>
          typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
        z.date().max(new Date(), {
          message: "ID issue date cannot be in the future",
        })
      )
      .optional(),
    idExpiryDate: z
      .preprocess(
        (arg) =>
          typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
        z.date().refine((d) => d > new Date(), {
          message: "ID expiry date must be in the future",
        })
      )
      .optional(),

    licenseFrontImage: z
      .string()
      .url({ message: "License front image must be a valid URL" })
      .optional(),
    licenseBackImage: z
      .string()
      .url({ message: "License back image must be a valid URL" })
      .optional(),
    idFrontImage: z
      .string()
      .url({ message: "ID front image must be a valid URL" })
      .optional(),
    idBackImage: z
      .string()
      .url({ message: "ID back image must be a valid URL" })
      .optional(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    { message: "At least one field must be provided for update" }
  );

export const driverUpdateSchema = z.object({
  body: driverUpdateBodySchema,
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
