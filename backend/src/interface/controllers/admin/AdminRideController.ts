import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetAdminRidesDto } from "@application/dto/admin/GetAdminRidesDto";
import { GetAdminRidesResponseDto } from "@application/dto/admin/GetAdminRidesResponseDto";
import { Result } from "@shared/utils/Result";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { GetAdminRatingsDto } from "@application/dto/admin/GetAdminRatingsDto";
import { GetAdminRatingsResponseDto } from "@application/dto/admin/GetAdminRatingsResponseDto";
import { GetAdminRideByIdDto } from "@application/dto/admin/GetAdminRideByIdDto";
import { GetAdminRideByIdResponseDto } from "@application/dto/admin/GetAdminRideByIdResponseDto";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { ApiResponse } from "@shared/types/Common";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";

@injectable()
export class AdminRideController {
  constructor(
    @inject(TYPES.GetAdminRidesUseCase)
    private readonly getAdminRidesUseCase: IUseCase<
      GetAdminRidesDto,
      Promise<Result<GetAdminRidesResponseDto>>
    >,
    @inject(TYPES.GetAdminRatingsUseCase)
    private readonly getAdminRatingsUseCase: IUseCase<
      GetAdminRatingsDto,
      Promise<Result<GetAdminRatingsResponseDto>>
    >,
    @inject(TYPES.GetAdminRideByIdUseCase)
    private readonly getAdminRideByIdUseCase: IUseCase<
      GetAdminRideByIdDto,
      Promise<Result<GetAdminRideByIdResponseDto>>
    >,
  ) {}

  async getRides(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get rides received", { query: req.query });

      const dto = GetAdminRidesDto.fromRequest(req.query);
      const result = await this.getAdminRidesUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get rides failed", { error: error.message });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: RIDE_MESSAGES.RIDES_FETCHED_SUCCESSFULLY,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("Admin get rides controller error", {
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "admin_get_rides",
      );
      res.status(statusCode).json(response);
    }
  }

  async getRatings(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get ratings received", { query: req.query });

      const dto = GetAdminRatingsDto.fromRequest(req.query);
      const result = await this.getAdminRatingsUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get ratings failed", { error: error.message });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.RATINGS.FETCHED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("Admin get ratings controller error", {
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async getRideById(req: Request, res: Response): Promise<void> {
    try {
      const rideId = req.params.rideId;

      Logger.info("Admin get ride by ID received", { rideId });

      const dto = GetAdminRideByIdDto.fromRequest({ rideId: rideId as string });
      const result = await this.getAdminRideByIdUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get ride by ID failed", {
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("Admin get ride by ID controller error", {
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
