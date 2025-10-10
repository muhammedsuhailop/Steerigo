import { Request, Response } from "express";
import { injectable, inject } from "inversify";
// import { RegisterDriverUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { DriverRegistrationUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { GetDriverProfileUseCase } from "@application/use-cases/driver/GetDriverProfileUseCase";
import { UpdateDriverProfileUseCase } from "@application/use-cases/driver/UpdateDriverProfileUseCase";
import { SubmitKYCUseCase } from "@application/use-cases/driver/SubmitKYCUseCase";
import { GetKYCStatusUseCase } from "@application/use-cases/driver/GetKYCStatusUseCase";
// import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverUpdateRequestDto } from "@application/dto/driver/DriverUpdateRequestDto";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { DocumentType } from "@domain/value-objects/DocumentType";

interface DriverRegistrationRequestBody {
  // User profile data
  name: string;
  mobile: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  state: string;
  pin: string;
  address: string;

  // Vehicle types (optional, for backward compatibility)
  vehicleTypes?: string[];
  gearTypes?: string[];

  // License data
  licenseCategory: LicenseCategory;
  licenseNumber: string;
  licenseBodyTypes: BodyType[];
  licenseGearTypes: GearType[];
  licenseIssueDate: string;
  licenseExpiryDate: string;

  // ID document data
  idType: DocumentType;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;

  // Document images
  licenseFrontImage: string;
  licenseBackImage: string;
  idFrontImage: string;
  idBackImage: string;
}

// Keep existing interfaces for backward compatibility
interface DriverRegistrationRequestBody {
  eligibleGearTypes: GearType[];
  eligibleBodyTypes: BodyType[];
  licenceCategory: LicenseCategory;
  licenseIssueDate: string;
  licenseExpiryDate: string;
}

interface DriverUpdateRequestBody {
  eligibleGearTypes?: GearType[];
  eligibleBodyTypes?: BodyType[];
  licenceCategory?: LicenseCategory;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
}

interface KYCSubmissionRequestBody {
  docType: DocumentType;
  docNumber: string;
  issueDate?: string;
  expiryDate?: string;
  frontImageUrls?: string[];
  backImageUrls?: string[];
}

@injectable()
export class DriverController {
  constructor(
    @inject(TYPES.RegisterDriverUseCase)
    private registerDriverUseCase: DriverRegistrationUseCase,
    // @inject(TYPES.RegisterDriverUseCase)
    // private RegisterDriverUseCase: RegisterDriverUseCase,
    @inject(TYPES.GetDriverProfileUseCase)
    // private getDriverProfileUseCase: GetDriverProfileUseCase,
    // @inject(TYPES.UpdateDriverProfileUseCase)
    private updateDriverProfileUseCase: UpdateDriverProfileUseCase,
    @inject(TYPES.SubmitKYCUseCase)
    private submitKYCUseCase: SubmitKYCUseCase,
    @inject(TYPES.GetKYCStatusUseCase)
    private getKYCStatusUseCase: GetKYCStatusUseCase
  ) {}

  private getUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.userId ?? null;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const body = req.body as DriverRegistrationRequestBody;

      // Validate required fields for comprehensive registration
      const requiredFields = [
        "name",
        "mobile",
        "dob",
        "gender",
        "state",
        "pin",
        "address",
        "licenseCategory",
        "licenseNumber",
        "licenseBodyTypes",
        "licenseGearTypes",
        "licenseIssueDate",
        "licenseExpiryDate",
        "idType",
        "idNumber",
        "idIssueDate",
        "idExpiryDate",
        "licenseFrontImage",
        "licenseBackImage",
        "idFrontImage",
        "idBackImage",
      ];

      const missingFields = requiredFields.filter(
        (field) => !body[field as keyof typeof body]
      );

      if (missingFields.length > 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Create comprehensive DTO
      const dto = new DriverRegistrationRequestDto(
        body.name,
        body.mobile,
        new Date(body.dob),
        body.gender,
        body.state,
        body.pin,
        body.address,
        body.licenseCategory,
        body.licenseNumber,
        body.licenseBodyTypes,
        body.licenseGearTypes,
        new Date(body.licenseIssueDate),
        new Date(body.licenseExpiryDate),
        body.idType,
        body.idNumber,
        new Date(body.idIssueDate),
        new Date(body.idExpiryDate),
        body.licenseFrontImage,
        body.licenseBackImage,
        body.idFrontImage,
        body.idBackImage
      );

      const result = await this.registerDriverUseCase.execute(userId, dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message:
            "Driver registration successful with profile update and KYC documents created",
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Comprehensive driver registration controller error", {
        error,
      });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Keep existing methods for backward compatibility
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const body = req.body as DriverUpdateRequestBody;
      const {
        eligibleGearTypes,
        eligibleBodyTypes,
        licenceCategory,
        licenseIssueDate,
        licenseExpiryDate,
      } = body;

      const dto = new DriverUpdateRequestDto(
        eligibleGearTypes,
        eligibleBodyTypes,
        licenceCategory,
        licenseIssueDate ? new Date(licenseIssueDate) : undefined,
        licenseExpiryDate ? new Date(licenseExpiryDate) : undefined
      );

      const result = await this.updateDriverProfileUseCase.execute(userId, dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "Driver profile updated successfully",
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Update driver profile controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async submitKYC(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const body = req.body as KYCSubmissionRequestBody;
      const {
        docType,
        docNumber,
        issueDate,
        expiryDate,
        frontImageUrls,
        backImageUrls,
      } = body;

      if (!docType || !docNumber) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Document type and number are required",
        });
        return;
      }

      const dto = new KYCSubmissionRequestDto(
        docType,
        docNumber,
        issueDate ? new Date(issueDate) : undefined,
        expiryDate ? new Date(expiryDate) : undefined,
        frontImageUrls || [],
        backImageUrls || []
      );

      const result = await this.submitKYCUseCase.execute(userId, dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: "KYC document submitted successfully",
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Submit KYC controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getKYCStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const result = await this.getKYCStatusUseCase.execute(userId);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "KYC status retrieved successfully",
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Get KYC status controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
