import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { GetDriversUseCase } from "@application/use-cases/admin/GetDriversUseCase";
import { GetDriversDto } from "@application/dto/admin/GetDriversDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { DriverActionDto } from "@application/dto/admin/DriverActionDto";
import { DriverActionUseCase } from "@application/use-cases/admin/DriverActionUseCase";
import { GetKycRequestsDto } from "@application/dto/admin/GetKycRequestsDto";
import { GetKycRequestsUseCase } from "@application/use-cases/admin/GetKycRequestsUseCase";
import { GetDriverProfileUseCase } from "@application/use-cases/admin/GetDriverProfileUseCase";
import { UpdateKycStatusUseCase } from "@application/use-cases/admin/UpdateKycStatusUseCase";
import { GetDriverProfileDto } from "@application/dto/admin/GetDriverProfileDto";
import { UpdateKycStatusDto } from "@application/dto/admin/UpdateKycStatusDto";
import { GetKycRequestByIdUseCase } from "@application/use-cases/admin/GetKycRequestByIdUseCase";
import { GetKycRequestByIdDto } from "@application/dto/admin/GetKycRequestByIdDto";

@injectable()
export class AdminDriverController {
  constructor(
    @inject(GetDriversUseCase) private getDriversUseCase: GetDriversUseCase,
    @inject(DriverActionUseCase)
    private driverActionUseCase: DriverActionUseCase,
    @inject(GetKycRequestsUseCase)
    private getKycRequestsUseCase: GetKycRequestsUseCase,
    @inject(GetDriverProfileUseCase)
    private getDriverProfileUseCase: GetDriverProfileUseCase,
    @inject(UpdateKycStatusUseCase)
    private updateKycStatusUseCase: UpdateKycStatusUseCase,
    @inject(GetKycRequestByIdUseCase)
    private getKycRequestByIdUseCase: GetKycRequestByIdUseCase
  ) {}

  async getDrivers(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse<null> = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new GetDriversDto(req.query);
      const result = await this.getDriversUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse<null> = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: "Drivers fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in getDrivers controller", error);
      const response: ApiResponse<null> = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async driverAction(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new DriverActionDto({
        driverId: req.params.driverId,
        action: req.body.action,
      });

      const result = await this.driverActionUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: `Driver ${dto.action}ed successfully`,
      };
      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in driverAction controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async getKycRequests(req: Request, res: Response): Promise<void> {
    try {
      const dto = new GetKycRequestsDto(req.query);
      const result = await this.getKycRequestsUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "KYC requests fetched successfully",
        data: result.getValue(),
      };
      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in getKycRequests controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async getDriverProfile(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new GetDriverProfileDto({
        driverId: req.params.driverId,
      });

      const result = await this.getDriverProfileUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Driver profile fetched successfully",
        data: result.getValue(),
      };
      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in getDriverProfile controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async updateKycStatus(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((err) => `${err.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new UpdateKycStatusDto({
        kycId: req.params.kycId,
        kycStatus: req.body.kycStatus,
        comments: req.body.comments,
      });

      // Additional DTO validation
      const validationErrors = dto.validate();
      if (validationErrors.length > 0) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: validationErrors.join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.updateKycStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(400).json(response);
        return;
      }

      const resultData = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: resultData.message,
        data: {
          kycRequest: resultData.kycRequest,
          driverStatusUpdated: resultData.driverStatusUpdated,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in updateKycStatus controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async getKycRequestById(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          error: errors
            .array()
            .map((e) => `${e.msg}`)
            .join(", "),
        };
        res.status(400).json(response);
        return;
      }

      const dto = new GetKycRequestByIdDto({ kycId: req.params.kycId });
      const result = await this.getKycRequestByIdUseCase.execute(dto);

      if (result.isFailure()) {
        const response: ApiResponse = {
          success: false,
          message: result.getError().message,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "KYC request fetched successfully",
        data: result.getValue(),
      };
      res.status(200).json(response);
    } catch (error) {
      Logger.error("Error in getKycRequestById controller", error);
      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }
}
