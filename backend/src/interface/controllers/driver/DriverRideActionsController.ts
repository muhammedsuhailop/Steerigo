import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { MarkRideAsArrivedDto } from "@application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "@application/dto/driver/MarkRideAsArrivedResponseDto";
import { MarkRideAsStartedDto } from "@application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "@application/dto/driver/MarkRideAsStartedResponseDto";

@injectable()
export class DriverRideActionsController {
  constructor(
    @inject(TYPES.MarkRideAsArrivedUseCase)
    private markRideAsArrivedUseCase: IUseCase<
      MarkRideAsArrivedDto,
      Promise<Result<MarkRideAsArrivedResponseDto>>
    >,
    @inject(TYPES.MarkRideAsStartedUseCase)
    private markRideAsStartedUseCase: IUseCase<
      MarkRideAsStartedDto,
      Promise<Result<MarkRideAsStartedResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async markRideAsArrived(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const rideId = req.params.rideId;
      if (!rideId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: DRIVER_MESSAGES.RIDE_ID_REQUIRED,
        });
        return;
      }

      Logger.info("Mark ride as arrived request received", {
        userId,
        rideId,
      });

      const dto = MarkRideAsArrivedDto.fromRequest(userId, { rideId });

      const result = await this.markRideAsArrivedUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Mark ride as arrived failed", {
          userId,
          rideId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "mark_ride_as_arrived",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride marked as arrived successfully", {
        userId,
        rideId: responseData.data.rideId,
        arrivedAt: responseData.data.arrivedAt,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Mark ride as arrived controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "mark_ride_as_arrived",
      );
      res.status(statusCode).json(response);
    }
  }

  async markRideAsStarted(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const rideId = req.params.rideId;
      if (!rideId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: DRIVER_MESSAGES.RIDE_ID_REQUIRED,
        });
        return;
      }

      Logger.info("Mark ride as started request received", { userId, rideId });

      const dto = MarkRideAsStartedDto.fromRequest(userId, { rideId });
      const result = await this.markRideAsStartedUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Mark ride as started failed", {
          userId,
          rideId,
          error: error.message,
        });
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "mark_ride_as_started",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride marked as started successfully", {
        userId,
        rideId: responseData.data.rideId,
        arrivedAt: responseData.data.arrivedAt,
        startedAt: responseData.data.startedAt,
        wasArrivedAutoSet: responseData.data.wasArrivedAutoSet,
      });
      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Mark ride as started controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "mark_ride_as_started",
      );
      res.status(statusCode).json(response);
    }
  }
}
