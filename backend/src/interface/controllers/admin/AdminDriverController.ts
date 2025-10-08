import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetDriversUseCase } from "@application/use-cases/admin/GetDriversUseCase";
import { DriverActionUseCase } from "@application/use-cases/admin/DriverActionUseCase";
import { GetDriverProfileUseCase } from "@application/use-cases/admin/GetDriverProfileUseCase";
import { GetKycRequestsUseCase } from "@application/use-cases/admin/GetKycRequestsUseCase";
import { UpdateKycStatusUseCase } from "@application/use-cases/admin/UpdateKycStatusUseCase";
import { GetKycRequestByIdUseCase } from "@application/use-cases/admin/GetKycRequestByIdUseCase";
import { GetDriversRequestDto } from "@application/dto/admin/GetDriversRequestDto";
import { DriverActionRequestDto } from "@application/dto/admin/DriverActionRequestDto";
import { GetDriverProfileRequestDto } from "@application/dto/admin/GetDriverProfileRequestDto";
import { GetKycRequestsRequestDto } from "@application/dto/admin/GetKycRequestsRequestDto";
import { UpdateKycStatusRequestDto } from "@application/dto/admin/UpdateKycStatusRequestDto";
import { GetKycRequestByIdRequestDto } from "@application/dto/admin/GetKycRequestByIdRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class AdminDriverController {
  constructor(
    @inject(TYPES.GetDriversUseCase)
    private getDriversUseCase: GetDriversUseCase,
    @inject(TYPES.DriverActionUseCase)
    private driverActionUseCase: DriverActionUseCase,
    @inject(TYPES.GetDriverProfileUseCase)
    private getDriverProfileUseCase: GetDriverProfileUseCase,
    @inject(TYPES.GetKycRequestsUseCase)
    private getKycRequestsUseCase: GetKycRequestsUseCase,
    @inject(TYPES.UpdateKycStatusUseCase)
    private updateKycStatusUseCase: UpdateKycStatusUseCase,
    @inject(TYPES.GetKycRequestByIdUseCase)
    private getKycRequestByIdUseCase: GetKycRequestByIdUseCase
  ) {}

  async getDrivers(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetDriversRequestDto(req.query);
      const result = await this.getDriversUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_drivers"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "Drivers fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
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
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "driver_action"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse<any> = {
        success: true,
        message: data.message,
        data: {
          driverId: data.driverId,
          newStatus: data.newStatus,
        },
      };

      res.status(200).json(response);
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
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_profile"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "Driver profile fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
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
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_kyc_requests"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "KYC requests fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
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
        kycStatus: req.body.kycStatus,
        comments: req.body.comments,
        reviewedBy: req.body.reviewedBy || (req as any).user?.id, // Get from auth middleware
      });

      const result = await this.updateKycStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_kyc_status"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse<any> = {
        success: true,
        message: data.message,
        data: {
          kycRequest: data.kycRequest,
          driverStatusUpdated: data.driverStatusUpdated,
        },
      };

      res.status(200).json(response);
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
      const dto = new GetKycRequestByIdRequestDto({
        kycId: req.params.kycId,
      });

      const result = await this.getKycRequestByIdUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_kyc_request_by_id"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "KYC request fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_kyc_request_by_id"
      );
      res.status(statusCode).json(response);
    }
  }
}
