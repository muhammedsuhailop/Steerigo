import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { MarkRideAsArrivedDto } from "@application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "@application/dto/driver/MarkRideAsArrivedResponseDto";
import { MarkRideAsStartedDto } from "@application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "@application/dto/driver/MarkRideAsStartedResponseDto";
import { MarkRideAsCompletedDto } from "@application/dto/driver/MarkRideAsCompletedDto";
import { MarkRideAsCompletedResponseDto } from "@application/dto/driver/MarkRideAsCompletedResponseDto";
import { DriverCancelRideDto } from "@application/dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "@application/dto/driver/DriverCancelRideResponseDto";

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
    @inject(TYPES.MarkRideAsCompletedUseCase)
    private markRideAsCompletedUseCase: IUseCase<
      MarkRideAsCompletedDto,
      Promise<Result<MarkRideAsCompletedResponseDto>>
    >,
    @inject(TYPES.DriverCancelRideUseCase)
    private readonly driverCancelRideUseCase: IUseCase<
      DriverCancelRideDto,
      Promise<Result<DriverCancelRideResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async markRideAsArrived(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;

      const rideId = req.params.rideId;

      Logger.info("Mark ride as arrived request received", {
        userId,
        rideId,
      });

      const dto = MarkRideAsArrivedDto.fromRequest(userId, {
        rideId: rideId as string,
      });

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
      const userId = this.getUserId(req) as string;

      const rideId = req.params.rideId;

      Logger.info("Mark ride as started request received", { userId, rideId });

      const dto = MarkRideAsStartedDto.fromRequest(userId, {
        rideId: rideId as string,
      });
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

  async markRideAsCompleted(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;

      const rideId = req.params.rideId;

      Logger.info("Mark ride as completed received", { userId, rideId });

      const dto = MarkRideAsCompletedDto.fromRequest(userId, {
        rideId: rideId as string,
      });
      const result = await this.markRideAsCompletedUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Mark ride as completed failed", {
          userId,
          rideId,
          error: error.message,
        });
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "mark_ride_as_completed",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride completed successfully", {
        userId,
        rideId: responseData.data.rideId,
        totalFare: responseData.data.fareBreakdown.totalFare.amount,
        actualDurationMinutes:
          responseData.data.fareBreakdown.actualDurationMinutes,
        durationHours: responseData.data.fareBreakdown.durationHours,
      });
      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Mark ride as completed controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "mark_ride_as_completed",
      );
      res.status(statusCode).json(response);
    }
  }

  async cancelRide(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;

      const rideId = req.params.rideId;

      Logger.info("Driver cancel ride request received", {
        userId,
        rideId,
        body: req.body,
      });

      const dto = DriverCancelRideDto.fromRequest(
        userId,
        { rideId: rideId as string },
        req.body,
      );
      const result = await this.driverCancelRideUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Driver cancel ride failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "driver_cancel_ride",
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      Logger.info("Ride cancelled by driver successfully", {
        userId,
        rideId: data.rideId,
        penaltyAmount: data.driverPenalty.amount,
        penaltyDeducted: data.penaltyDeducted,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data,
      });
    } catch (error) {
      Logger.error("Driver cancel ride controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "driver_cancel_ride",
      );
      res.status(statusCode).json(response);
    }
  }
}
