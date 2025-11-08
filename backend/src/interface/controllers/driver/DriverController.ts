import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { DriverRegistrationUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { UpdateDriverProfileUseCase } from "@application/use-cases/driver/UpdateDriverProfileUseCase";
import { SubmitKYCUseCase } from "@application/use-cases/driver/SubmitKYCUseCase";
import { GetKYCStatusUseCase } from "@application/use-cases/driver/GetKYCStatusUseCase";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { GetDriverDashboardUseCase } from "@application/use-cases/driver/GetDriverDashboardUseCase";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { GetDriverStatusUseCase } from "@application/use-cases/driver/GetDriverStatusUseCase";
import { GetDriverDetailedProfileUseCase } from "@application/use-cases/driver/GetDriverDetailedProfileUseCase";
import { GetDriverProfileRequestDto } from "@application/dto/driver/GetDriverProfileRequestDto";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";

interface DriverRegistrationRequestBody {
  name: string;
  mobile: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  state: string;
  pin: string;
  address: string;

  licenseCategory: LicenseCategory;
  licenseNumber: string;
  licenseBodyTypes: BodyType[];
  licenseGearTypes: GearType[];
  licenseIssueDate: string;
  licenseExpiryDate: string;

  idType: DocumentType;
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;

  licenseFrontImage: string;
  licenseBackImage: string;
  idFrontImage: string;
  idBackImage: string;
}

interface DriverProfileUpdateRequestBody {
  name?: string;
  mobile?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  state?: string;
  pin?: string;
  address?: string;

  eligibleGearTypes?: GearType[];
  eligibleBodyTypes?: BodyType[];
  licenceCategory?: LicenseCategory;
  licenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;

  idType?: DocumentType;
  idNumber?: string;
  idIssueDate?: string;
  idExpiryDate?: string;

  licenseFrontImage?: string;
  licenseBackImage?: string;
  idFrontImage?: string;
  idBackImage?: string;
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
    @inject(TYPES.GetDriverDetailedProfileUseCase)
    private getDetailedProfileUseCase: GetDriverDetailedProfileUseCase,
    @inject(TYPES.UpdateDriverProfileUseCase)
    private updateDriverProfileUseCase: UpdateDriverProfileUseCase,
    @inject(TYPES.SubmitKYCUseCase)
    private SubmitKYCUseCase: SubmitKYCUseCase,
    @inject(TYPES.GetKYCStatusUseCase)
    private getKYCStatusUseCase: GetKYCStatusUseCase,
    @inject(TYPES.GetDriverDashboardUseCase)
    private getDashboardUseCase: GetDriverDashboardUseCase,
    @inject(TYPES.GetDriverStatusUseCase)
    private getStatusUseCase: GetDriverStatusUseCase
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
          .json({ success: false, message: DRIVER_MESSAGES.UNAUTHORIZED });
        return;
      }

      const body = req.body as DriverRegistrationRequestBody;

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
        // "idExpiryDate",
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
          message:
            DRIVER_MESSAGES.MISSING_FIELDS_PREFIX + missingFields.join(", "),
        });
        return;
      }

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
        body.idExpiryDate && body.idExpiryDate.trim() !== ""
          ? new Date(body.idExpiryDate)
          : null,
        body.licenseFrontImage,
        body.licenseBackImage,
        body.idFrontImage,
        body.idBackImage
      );

      const result = await this.registerDriverUseCase.execute(userId, dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: DRIVER_MESSAGES.DRIVER_REGISTRATION_SUCCESS,
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
        message: DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: DRIVER_MESSAGES.UNAUTHORIZED });
        return;
      }

      const body = req.body as DriverProfileUpdateRequestBody;

      const dto = new DriverProfileUpdateDto(
        body.name,
        body.mobile,
        body.dob ? new Date(body.dob) : undefined,
        body.gender,
        body.state,
        body.pin,
        body.address,
        body.eligibleGearTypes,
        body.eligibleBodyTypes,
        body.licenceCategory,
        body.licenseNumber,
        body.licenseIssueDate ? new Date(body.licenseIssueDate) : undefined,
        body.licenseExpiryDate ? new Date(body.licenseExpiryDate) : undefined,
        body.idType,
        body.idNumber,
        body.idIssueDate ? new Date(body.idIssueDate) : undefined,
        body.idExpiryDate ? new Date(body.idExpiryDate) : undefined,
        body.licenseFrontImage,
        body.licenseBackImage,
        body.idFrontImage,
        body.idBackImage
      );

      const result = await this.updateDriverProfileUseCase.execute(userId, dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: DRIVER_MESSAGES.PROFILE_UPDATE_SUCCESS,
          data: responseData.driver,
          updateSummary: {
            userUpdated: responseData.userUpdated,
            licenseKycUpdated: responseData.licenseKycUpdated,
            idKycUpdated: responseData.idKycUpdated,
            updatedFields: responseData.updatedFields,
          },
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
        message: DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async submitKYC(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized - User ID not found",
        });
        return;
      }

      const docType = req.body.docType;

      const VALID_DOC_TYPES = [
        "License",
        "Aadhaar",
        "PAN",
        "Passport",
        "Voter_ID",
      ];
      if (!docType || !VALID_DOC_TYPES.includes(docType)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: `Invalid or missing document type. Accepted: ${VALID_DOC_TYPES.join(", ")}`,
        });
        return;
      }

      Logger.info("KYC submission request received", {
        userId,
        docType,
        body: Object.keys(req.body),
      });

      const dto = this.createKYCDtoFromDocType(req.body, docType);

      Logger.info("KYC submission DTO created", {
        userId,
        docType,
        hasLicense: dto.hasLicenseUpdate(),
        hasId: dto.hasIdUpdate(),
        hasImages: dto.hasImages(),
      });

      const result = await this.SubmitKYCUseCase.execute(userId, dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("KYC submission failed", {
          userId,
          docType,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "submit_kyc"
        );

        res.status(statusCode).json(response);
        return;
      }

      const response = result.getValue();

      Logger.info("KYC submission successful", {
        userId,
        docType,
        licenseUpdated: response.licenseUpdated,
        idUpdated: response.idUpdated,
        driverUpdated: response.driverUpdated,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: response.message,
        data: {
          kycDocuments: response.kycDocuments,
          licenseUpdated: response.licenseUpdated,
          idUpdated: response.idUpdated,
          driverUpdated: response.driverUpdated,
        },
      });
    } catch (error) {
      Logger.error("KYC submission controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "submit_kyc"
      );

      res.status(statusCode).json(response);
    }
  }

  private createKYCDtoFromDocType(
    body: any,
    docType: string
  ): KYCSubmissionRequestDto {
    if (docType === "License") {
      return new KYCSubmissionRequestDto(
        body.licenseCategory as LicenseCategory,
        body.docNumber,
        body.eligibleBodyTypes || undefined,
        body.eligibleGearTypes || undefined,
        body.issueDate ? new Date(body.issueDate) : undefined,
        body.expiryDate ? new Date(body.expiryDate) : undefined,
        body.frontImageUrls?.[0] || undefined,
        body.backImageUrls?.[0] || undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }

    return new KYCSubmissionRequestDto(
      undefined, // licenseCategory
      undefined, // licenseNumber
      undefined, // licenseBodyTypes
      undefined, // licenseGearTypes
      undefined, // licenseIssueDate
      undefined, // licenseExpiryDate
      undefined, // licenseFrontImage
      undefined, // licenseBackImage
      docType as DocumentType,
      body.docNumber,
      body.issueDate ? new Date(body.issueDate) : undefined,
      body.expiryDate ? new Date(body.expiryDate) : undefined,
      body.frontImageUrls?.[0] || undefined,
      body.backImageUrls?.[0] || undefined
    );
  }

  async getKYCStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: DRIVER_MESSAGES.UNAUTHORIZED });
        return;
      }

      const result = await this.getKYCStatusUseCase.execute(userId);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: DRIVER_MESSAGES.KYC_STATUS_RETRIEVED,
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
        message: DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: DRIVER_MESSAGES.UNAUTHORIZED });
        return;
      }

      const dto = new GetDriverDashboardDto(userId);

      const result = await this.getDashboardUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_dashboard"
        );
        res.status(statusCode).json(response);
        return;
      }

      const dashboardResponse = result.getValue();

      res.status(HttpStatusCodes.OK).json(dashboardResponse);

      Logger.info(DRIVER_MESSAGES.DRIVER_DASHBOARD_RETURNED, { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_dashboard"
      );
      res.status(statusCode).json(response);
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.STATUS_USERID_NOT_FOUND,
        });
        return;
      }

      Logger.info("Getting driver status", { userId });

      const result = await this.getStatusUseCase.execute(userId);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_status"
        );
        res.status(statusCode).json(response);
        return;
      }

      const statusResponse = result.getValue();

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: DRIVER_MESSAGES.DRIVER_STATUS_RETRIEVED,
        data: statusResponse,
      });

      Logger.info("Driver status returned successfully", { userId });
    } catch (error) {
      Logger.error("Get driver status controller error", { error });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_status"
      );
      res.status(statusCode).json(response);
    }
  }

  async getDetailedProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: DRIVER_MESSAGES.UNAUTHORIZED });
        return;
      }

      Logger.info("Get detailed driver profile request", {
        userId,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      const dto = new GetDriverProfileRequestDto(userId);

      const result = await this.getDetailedProfileUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();

        Logger.warn(DRIVER_MESSAGES.DRIVER_DETAILED_PROFILE_FETCH_FAILED, {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_detailed_profile"
        );

        res.status(statusCode).json(response);
        return;
      }

      const profileResponse = result.getValue();

      res.status(HttpStatusCodes.OK).json({
        success: profileResponse.success,
        message: profileResponse.message,
        data: profileResponse.data,
      });

      Logger.info(DRIVER_MESSAGES.DRIVER_DETAILED_PROFILE_RETURNED, {
        userId,
        driverId: profileResponse.data.driverId,
        responseSize: JSON.stringify(profileResponse.data).length,
      });
    } catch (error) {
      Logger.error("Get detailed driver profile controller error", {
        userId: req.params.userId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_detailed_profile"
      );

      res.status(statusCode).json(response);
    }
  }
}
