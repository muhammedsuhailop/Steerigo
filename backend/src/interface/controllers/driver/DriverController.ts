import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { GetDriverProfileRequestDto } from "@application/dto/driver/GetDriverProfileRequestDto";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetDriverProfileResponseDto } from "@application/dto/driver/GetDriverProfileResponseDto";
import { UpdateDriverProfileResponseDto } from "@application/dto/driver/UpdateDriverProfileResponseDto";
import { SubmitKYCResponseDto } from "@application/dto/driver/SubmitKYCResponseDto";
import { KYCResponseDto } from "@application/dto/driver/KYCResponseDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { RegisterDriverResult } from "@application/use-cases/driver/RegisterDriverUseCase";
import { Gender } from "@domain/value-objects/Gender";

interface DriverRegistrationRequestBody {
  name: string;
  mobile: string;
  dob: string;
  gender: Gender;
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

interface LicenseKYCRequestBody {
  licenseCategory: LicenseCategory;
  docNumber: string;
  eligibleBodyTypes?: BodyType[];
  eligibleGearTypes?: GearType[];
  issueDate?: string;
  expiryDate?: string;
  frontImageUrls?: string[];
  backImageUrls?: string[];
}

interface GenericKYCRequestBody {
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
    private registerDriverUseCase: IUseCase<
      DriverRegistrationRequestDto,
      Promise<Result<RegisterDriverResult>>
    >,
    @inject(TYPES.GetDriverDetailedProfileUseCase)
    private getDetailedProfileUseCase: IUseCase<
      GetDriverProfileRequestDto,
      Promise<Result<GetDriverProfileResponseDto>>
    >,
    @inject(TYPES.UpdateDriverProfileUseCase)
    private updateDriverProfileUseCase: IUseCase<
      DriverProfileUpdateDto,
      Promise<Result<UpdateDriverProfileResponseDto>>
    >,
    @inject(TYPES.SubmitKYCUseCase)
    private SubmitKYCUseCase: IUseCase<
      KYCSubmissionRequestDto,
      Promise<Result<SubmitKYCResponseDto>>
    >,
    @inject(TYPES.GetKYCStatusUseCase)
    private getKYCStatusUseCase: IUseCase<
      string,
      Promise<Result<KYCResponseDto[]>>
    >,
    @inject(TYPES.GetDriverDashboardUseCase)
    private getDashboardUseCase: IUseCase<
      GetDriverDashboardDto,
      Promise<Result<DriverDashboardResponseDto>>
    >,
    @inject(TYPES.GetDriverStatusUseCase)
    private getStatusUseCase: IUseCase<
      string,
      Promise<Result<DriverStatusResponseDto>>
    >
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
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

      const dto = DriverRegistrationRequestDto.fromRequest(userId, body);

      Logger.info("Driver registration request received", {
        userId,
        name: body.name,
        mobile: body.mobile,
        licenseCategory: body.licenseCategory,
      });

      const result = await this.registerDriverUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        Logger.info("Driver registration successful", {
          userId,
          driverId: responseData.driver.id,
          licenseKycId: responseData.kycDocumentsCreated.license,
          idKycId: responseData.kycDocumentsCreated.idDocument,
        });

        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: DRIVER_MESSAGES.DRIVER_REGISTRATION_SUCCESS,
          data: responseData,
        });
      } else {
        const error = result.getError();
        Logger.warn("Driver registration failed", {
          userId,
          error: error.message,
        });

        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      Logger.error("Driver registration controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
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

      const body = req.body;

      Logger.info("Driver profile update request received", {
        userId,
        fields: Object.keys(body || {}),
      });

      const dto = DriverProfileUpdateDto.fromRequest(userId, body);

      Logger.info("Driver profile update DTO created", {
        userId,
        hasUserUpdates: dto.hasUserProfileUpdates(),
        hasVehicleUpdates: dto.hasVehicleTypeUpdates(),
      });

      const result = await this.updateDriverProfileUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Driver profile update failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_driver_profile"
        );

        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();

      Logger.info("Driver profile update successful", {
        userId,
        userUpdated: responseData.userUpdated,
        vehiclesUpdated: responseData.vehiclesUpdated,
        kycStatusUpdated: responseData.kycStatusUpdated,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: DRIVER_MESSAGES.PROFILE_UPDATE_SUCCESS,
        data: {
          driver: responseData.driver,
          updateSummary: {
            userUpdated: responseData.userUpdated,
            vehiclesUpdated: responseData.vehiclesUpdated,
            kycStatusUpdated: responseData.kycStatusUpdated,
            updatedFields: responseData.updatedFields,
          },
        },
      });
    } catch (error) {
      Logger.error("Update driver profile controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_driver_profile"
      );

      res.status(statusCode).json(response);
    }
  }

  async submitKYC(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.STATUS_USERID_NOT_FOUND,
        });
        return;
      }

      const docType = req.body.docType;

      const VALID_DOC_TYPES = [
        DocumentType.LICENSE,
        DocumentType.AADHAAR,
        DocumentType.PAN,
        DocumentType.PASSPORT,
      ];

      if (!docType || !VALID_DOC_TYPES.includes(docType)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: `${DRIVER_MESSAGES.INVALID_MISSING_DOC_TYPE} Accepted: ${VALID_DOC_TYPES.join(", ")}`,
        });
        return;
      }

      Logger.info("KYC submission request received", {
        userId,
        docType,
        body: Object.keys(req.body),
      });

      let dto: KYCSubmissionRequestDto;

      if (docType === DocumentType.LICENSE) {
        const licenseBody = req.body as LicenseKYCRequestBody;
        dto = KYCSubmissionRequestDto.fromLicenseRequest(userId, licenseBody);
      } else {
        const genericBody = req.body as GenericKYCRequestBody;
        dto = KYCSubmissionRequestDto.fromGenericRequest(
          userId,
          docType as DocumentType,
          genericBody
        );
      }

      Logger.info("KYC submission DTO created", {
        userId,
        docType,
        hasLicense: dto.hasLicenseUpdate(),
        hasId: dto.hasIdUpdate(),
        hasImages: dto.hasImages(),
      });

      const result = await this.SubmitKYCUseCase.execute(dto);

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

      const dto = GetDriverDashboardDto.fromRequest(userId);

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
