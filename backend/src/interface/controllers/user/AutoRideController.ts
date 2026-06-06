import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AutoSearchAndRequestDto } from "@application/dto/user/AutoSearchAndRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { AutoSearchAndRequestResponseDto } from "@application/dto/user/AutoSearchAndRequestResponseDto";
import { Result } from "@shared/utils/Result";
import { CancelRideRequestDto } from "@application/dto/user/CancelRideRequestDto";
import { CancelRideRequestResponseDto } from "@application/dto/user/CancelRideRequestResponseDto";
import { USER_MESSAGES } from "@shared/constants/UserMessages";
import { ScheduleFutureRideDto } from "@application/dto/user/ScheduleFutureRideDto";
import { ScheduleFutureRideResponseDto } from "@application/dto/user/ScheduleFutureRideResponseDto";
import { CancelFutureRideDto } from "@application/dto/user/CancelFutureRideDto";
import { CancelFutureRideResponseDto } from "@application/dto/user/CancelFutureRideResponseDto";

@injectable()
export class AutoRideController {
  constructor(
    @inject(TYPES.AutoSearchAndSendRideRequestUseCase)
    private autoSearchAndSendUseCase: IUseCase<
      AutoSearchAndRequestDto,
      Promise<Result<AutoSearchAndRequestResponseDto>>
    >,
    @inject(TYPES.CancelRideRequestsUseCase)
    private readonly cancelRideRequestsUseCase: IUseCase<
      CancelRideRequestDto,
      Promise<Result<CancelRideRequestResponseDto>>
    >,
    @inject(TYPES.ScheduleFutureRideRequestUseCase)
    private readonly scheduleUseCase: IUseCase<
      ScheduleFutureRideDto,
      Promise<Result<ScheduleFutureRideResponseDto>>
    >,
    @inject(TYPES.CancelFutureRideRequestUseCase)
    private readonly cancelUseCase: IUseCase<
      CancelFutureRideDto,
      Promise<Result<CancelFutureRideResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async autoSearchAndSendRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const {
        latitude,
        longitude,
        searchDate,
        timeRequired,
        radiusKm,
        gearType,
        bodyType,
        maxRideRequests,
      } = req.body;

      Logger.info("Auto search and send ride request received", {
        userId,
        latitude,
        longitude,
        searchDate,
        radiusKm,
        timeRequired,
        gearType,
        bodyType,
        maxRideRequests,
      });

      const dto = AutoSearchAndRequestDto.fromRequest(
        userId as string,
        req.body,
      );

      const result = await this.autoSearchAndSendUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          requestGroupId: responseData.result.requestGroupId,
          data: {
            successfulRequests: responseData.result.successfulRequests,
            failedRequests: responseData.result.failedRequests,
            summary: {
              totalDriversFound: responseData.result.totalDriversFound,
              successCount: responseData.result.successCount,
              failureCount: responseData.result.failureCount,
              searchedAt: responseData.result.searchedAt,
            },
          },
        } as ApiResponse);

        Logger.info("Auto search and send ride request successful", {
          userId,
          successCount: responseData.result.successCount,
          failureCount: responseData.result.failureCount,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);

        res.status(statusCode).json(response);

        Logger.warn("Auto search and send ride request failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Auto search and send ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async cancelRideRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const { requestGroupId } = req.body;

      Logger.info("Cancel ride requests received", {
        userId,
        requestGroupId,
      });

      const dto = CancelRideRequestDto.fromRequest(userId as string, req.body);

      const result = await this.cancelRideRequestsUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: USER_MESSAGES.DRIVER_SEARCH.CANCELLED_SUCCESS,
          data: responseData,
        } as ApiResponse);

        Logger.info("Cancel ride requests successful", {
          userId,
          requestGroupId,
          cancelledCount: responseData.cancelledCount,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);

        res.status(statusCode).json(response);

        Logger.warn("Cancel ride requests failed", {
          userId,
          requestGroupId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Cancel ride requests controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async scheduleFutureRide(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const dto = ScheduleFutureRideDto.fromRequest(userId as string, req.body);
      const result = await this.scheduleUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          data: {
            requestGroupId: responseData.result.requestGroupId,
            totalDriversNotified: responseData.result.totalDriversNotified,
            pickupTime: responseData.result.pickupTime,
            expiresAt: responseData.result.expiresAt,
            scheduledAt: responseData.result.scheduledAt,
            scheduledRequests: responseData.result.scheduledRequests,
          },
        } as ApiResponse);

        Logger.info("Schedule future ride successful", {
          userId,
          requestGroupId: responseData.result.requestGroupId,
          driverCount: responseData.result.totalDriversNotified,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);

        Logger.warn("Schedule future ride failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Schedule future ride controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async cancelFutureRide(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      Logger.info("Cancel future ride request received", {
        userId,
        requestGroupId: req.body.requestGroupId,
      });

      const dto = CancelFutureRideDto.fromRequest(userId as string, req.body);
      const result = await this.cancelUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: USER_MESSAGES.DRIVER_SEARCH.SCHEDULE_CANCELLED,
          data: {
            requestGroupId: responseData.requestGroupId,
            cancelledCount: responseData.cancelledCount,
            cancelledAt: responseData.cancelledAt,
          },
        } as ApiResponse);

        Logger.info("Cancel future ride successful", {
          userId,
          requestGroupId: responseData.requestGroupId,
          cancelledCount: responseData.cancelledCount,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);

        Logger.warn("Cancel future ride failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Cancel future ride controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
