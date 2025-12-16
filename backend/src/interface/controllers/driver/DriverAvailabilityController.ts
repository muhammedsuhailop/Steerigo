import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  ScheduleAvailabilityRequestDto,
  UpdateStatusRequestDto,
  UpdateLocationRequestDto,
} from "@application/dto/driver";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DriverAvailabilityResponseDto } from "@application/dto/driver/DriverAvailabilityResponseDto";
import { UpdateAvailabilityStatusResponseDto } from "@application/dto/driver/UpdateAvailabilityStatusResponseDto";
import { UpdateDriverLocationResponseDto } from "@application/dto/driver/UpdateDriverLocationResponseDto";

@injectable()
export class DriverAvailabilityController {
  constructor(
    @inject(TYPES.ScheduleAvailabilityUseCase)
    private scheduleAvailabilityUseCase: IUseCase<
      ScheduleAvailabilityRequestDto,
      Promise<Result<DriverAvailabilityResponseDto>>
    >,
    @inject(TYPES.UpdateAvailabilityStatusUseCase)
    private updateStatusUseCase: IUseCase<
      UpdateStatusRequestDto,
      Promise<Result<UpdateAvailabilityStatusResponseDto>>
    >,
    @inject(TYPES.UpdateDriverLocationUseCase)
    private updateLocationUseCase: IUseCase<
      UpdateLocationRequestDto,
      Promise<Result<UpdateDriverLocationResponseDto>>
    >
  ) {}

  async scheduleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.DRIVER_AUTH_REQUIRED,
        });
        return;
      }

      const dto = ScheduleAvailabilityRequestDto.fromRequest(userId, req.body);
      const result = await this.scheduleAvailabilityUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "schedule_availability"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: DRIVER_MESSAGES.AVAILABILITY_SCHEDULED,
        data,
      };

      res.status(HttpStatusCodes.CREATED).json(response);
      Logger.info("Availability scheduled successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "schedule_availability"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = UpdateStatusRequestDto.fromRequest(req.body);

      const driverId = dto.getDriverId();
      const result = await this.updateStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_availability_status"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: DRIVER_MESSAGES.AVAILABILITY_STATUS_UPDATED,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Availability status updated successfully", {
        driverId,
        newStatus: dto.getStatus(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_availability_status"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const dto = UpdateLocationRequestDto.fromRequest(req.body);

      const driverId = dto.getDriverId();

      const result = await this.updateLocationUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_driver_location"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: DRIVER_MESSAGES.DRIVER_LOCATION_UPDATED,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Driver location updated successfully", { driverId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_driver_location"
      );
      res.status(statusCode).json(response);
    }
  }
}
