import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetDriversRequestDto } from "@application/dto/admin/GetDriversRequestDto";
import { DriverActionRequestDto } from "@application/dto/admin/DriverActionRequestDto";
import { GetDriverProfileRequestDto } from "@application/dto/admin/GetDriverProfileRequestDto";
import { GetKycRequestsRequestDto } from "@application/dto/admin/GetKycRequestsRequestDto";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { GetKycRequestByIdRequestDto } from "@application/dto/admin/GetKycRequestByIdRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { UpdateDriverKycStatusRequestDto } from "@application/dto/admin/UpdateDriverKycStatusRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import {
  AdminGetDriverProfileResponseDto,
  GetDriversResponseDto,
} from "@application/dto/admin";
import { GetKycRequestByIdResponseDto } from "@application/dto/admin/GetKycRequestByIdResponseDto";
import { GetKycRequestsResponseDto } from "@application/dto/admin/GetKycRequestsResponseDto";
import { UpdateDriverKycStatusResponseDto } from "@application/dto/admin/UpdateDriverKycStatusResponseDto";
import { KycDocumentResponseDto } from "@application/dto/admin/KycDocumentResponseDto";

@injectable()
export class AdminDriverController {
  constructor(
    @inject(TYPES.GetDriversUseCase)
    private getDriversUseCase: IUseCase<
      GetDriversRequestDto,
      Promise<Result<GetDriversResponseDto>>
    >,
    @inject(TYPES.DriverActionUseCase)
    private driverActionUseCase: IUseCase<
      DriverActionRequestDto,
      Promise<
        Result<{
          message: string;
          driverId: string;
          newStatus: string;
        }>
      >
    >,
    @inject(TYPES.GetDriverProfileUseCase)
    private getDriverProfileUseCase: IUseCase<
      GetDriverProfileRequestDto,
      Promise<Result<AdminGetDriverProfileResponseDto>>
    >,
    @inject(TYPES.GetKycRequestsUseCase)
    private getKycRequestsUseCase: IUseCase<
      GetKycRequestsRequestDto,
      Promise<Result<GetKycRequestsResponseDto>>
    >,
    @inject(TYPES.UpdateKycStatusUseCase)
    private updateKycStatusUseCase: IUseCase<
      UpdateKycStatusRequestDto,
      Promise<
        Result<{
          message: string;
          kycDocument: KycDocumentResponseDto;
          driverKycStatusUpdated: boolean;
        }>
      >
    >,
    @inject(TYPES.GetKycRequestByIdUseCase)
    private getKycRequestByIdUseCase: IUseCase<
      GetKycRequestByIdRequestDto,
      Promise<Result<GetKycRequestByIdResponseDto>>
    >,
    @inject(TYPES.UpdateDriverKycStatusUseCase)
    private updateDriverKycStatusUseCase: IUseCase<
      UpdateDriverKycStatusRequestDto,
      Promise<Result<UpdateDriverKycStatusResponseDto>>
    >
  ) {}

  async getDrivers(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetDriversRequestDto(req.query);
      const result = await this.getDriversUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "get_drivers"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.DRIVER.DRIVERS_FETCHED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_drivers"
      );
      res.status(statusCode).json(response);
    }
  }

  async driverAction(req: Request, res: Response): Promise<void> {
    try {
      const dto = new DriverActionRequestDto({
        driverId: req.params.driverId,
        action: req.body.action,
        reason: req.body.reason,
      });
      const result = await this.driverActionUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "driver_action"
        );
        res.status(statusCode).json(response);
        return;
      }
      const data = result.getValue();
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data: {
          driverId: data.driverId,
          newStatus: data.newStatus,
        },
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "driver_action"
      );
      res.status(statusCode).json(response);
    }
  }

  async getDriverProfile(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetDriverProfileRequestDto({
        driverId: req.params.driverId,
      });
      const result = await this.getDriverProfileUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "get_driver_profile"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.DRIVER.DRIVER_PROFILE_FETCHED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_profile"
      );
      res.status(statusCode).json(response);
    }
  }

  async getKycRequests(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetKycRequestsRequestDto(req.query);
      const result = await this.getKycRequestsUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "get_kyc_requests"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.DRIVER.KYC_REQUESTS_FETCHED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_kyc_requests"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateKycStatus(req: Request, res: Response): Promise<void> {
    try {
      const dto = new UpdateKycStatusRequestDto({
        kycId: req.params.kycId,
        verificationStatus: req.body.verificationStatus,
        comments: req.body.comments,
        docImageUrlsFront: req.body.docImageUrlsFront,
        docImageUrlsBack: req.body.docImageUrlsBack,
      });
      const result = await this.updateKycStatusUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "update_kyc_status"
        );
        res.status(statusCode).json(response);
        return;
      }
      const data = result.getValue();
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data: {
          kycDocument: data.kycDocument,
          driverKycStatusUpdated: data.driverKycStatusUpdated,
        },
      } as ApiResponse<unknown>);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_kyc_status"
      );
      res.status(statusCode).json(response);
    }
  }

  async getKycRequestById(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetKycRequestByIdRequestDto({ kycId: req.params.kycId });
      const result = await this.getKycRequestByIdUseCase.execute(dto);
      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "get_kyc_request_by_id"
        );
        res.status(statusCode).json(response);
        return;
      }
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.DRIVER.KYC_DOCUMENT_FETCHED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_kyc_request_by_id"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateDriverKycStatus(req: Request, res: Response): Promise<void> {
    try {
      const dto = new UpdateDriverKycStatusRequestDto({
        driverId: req.params.driverId,
        kycStatus: req.body.kycStatus,
        comments: req.body.comments,
      });

      const result = await this.updateDriverKycStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "update_driver_kyc_status"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data: {
          driverId: data.driverId,
          previousKycStatus: data.previousKycStatus,
          newKycStatus: data.newKycStatus,
        },
      } as ApiResponse);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_driver_kyc_status"
      );
      res.status(statusCode).json(response);
    }
  }
}
