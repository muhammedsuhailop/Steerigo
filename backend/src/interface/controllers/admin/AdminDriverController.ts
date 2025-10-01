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

@injectable()
export class AdminDriverController {
  constructor(
    @inject(GetDriversUseCase) private getDriversUseCase: GetDriversUseCase,
    @inject(DriverActionUseCase)
    private driverActionUseCase: DriverActionUseCase,
    @inject(GetKycRequestsUseCase)
    private getKycRequestsUseCase: GetKycRequestsUseCase
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
}
