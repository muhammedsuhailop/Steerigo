import { z } from "zod";
import { LicenseCategory } from "../../../domain/value-objects/LicenseCategory";
import { GearType, BodyType } from "../../../domain/value-objects/VehicleType";
import { DocumentType } from "../../../domain/value-objects/DocumentType";
import { Gender } from "../../../domain/value-objects/Gender";
export declare const driverRegistrationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        mobile: z.ZodString;
        dob: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
        gender: z.ZodEnum<typeof Gender>;
        state: z.ZodString;
        pin: z.ZodString;
        address: z.ZodString;
        licenseCategory: z.ZodEnum<{
            LMV: LicenseCategory.LMV;
            HMV: LicenseCategory.HMV;
            MCWG: LicenseCategory.MCWG;
            MCWOG: LicenseCategory.MCWOG;
        }>;
        licenseNumber: z.ZodString;
        licenseBodyTypes: z.ZodArray<z.ZodEnum<{
            Sedan: BodyType.SEDAN;
            SUV: BodyType.SUV;
            Hatchback: BodyType.HATCHBACK;
        }>>;
        licenseGearTypes: z.ZodArray<z.ZodEnum<{
            Manual: GearType.MANUAL;
            Automatic: GearType.AUTOMATIC;
        }>>;
        licenseIssueDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
        licenseExpiryDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
        idType: z.ZodEnum<{
            Aadhaar: DocumentType.AADHAAR;
            PAN: DocumentType.PAN;
            License: DocumentType.LICENSE;
            Passport: DocumentType.PASSPORT;
        }>;
        idNumber: z.ZodString;
        idIssueDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
        idExpiryDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodDate>>;
        licenseFrontImage: z.ZodString;
        licenseBackImage: z.ZodString;
        idFrontImage: z.ZodString;
        idBackImage: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const driverUpdateSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mobile: z.ZodString;
        dob: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>;
        gender: z.ZodOptional<z.ZodEnum<typeof Gender>>;
        state: z.ZodOptional<z.ZodString>;
        pin: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        eligibleGearTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Manual: GearType.MANUAL;
            Automatic: GearType.AUTOMATIC;
        }>>>;
        eligibleBodyTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Sedan: BodyType.SEDAN;
            SUV: BodyType.SUV;
            Hatchback: BodyType.HATCHBACK;
        }>>>;
        licenceCategory: z.ZodOptional<z.ZodEnum<{
            LMV: LicenseCategory.LMV;
            HMV: LicenseCategory.HMV;
            MCWG: LicenseCategory.MCWG;
            MCWOG: LicenseCategory.MCWOG;
        }>>;
        licenseNumber: z.ZodOptional<z.ZodString>;
        licenseIssueDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>;
        licenseExpiryDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>;
        idType: z.ZodOptional<z.ZodEnum<{
            Aadhaar: DocumentType.AADHAAR;
            PAN: DocumentType.PAN;
            License: DocumentType.LICENSE;
            Passport: DocumentType.PASSPORT;
        }>>;
        idNumber: z.ZodOptional<z.ZodString>;
        idIssueDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>;
        idExpiryDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>;
        licenseFrontImage: z.ZodOptional<z.ZodString>;
        licenseBackImage: z.ZodOptional<z.ZodString>;
        idFrontImage: z.ZodOptional<z.ZodString>;
        idBackImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const kycSubmissionSchema: z.ZodObject<{
    body: z.ZodObject<{
        docType: z.ZodEnum<{
            Aadhaar: DocumentType.AADHAAR;
            PAN: DocumentType.PAN;
            License: DocumentType.LICENSE;
            Passport: DocumentType.PASSPORT;
        }>;
        docNumber: z.ZodString;
        issueDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>;
        expiryDate: z.ZodNullable<z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDate>>>;
        frontImageUrls: z.ZodArray<z.ZodString>;
        backImageUrls: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=driverValidationSchemas.d.ts.map