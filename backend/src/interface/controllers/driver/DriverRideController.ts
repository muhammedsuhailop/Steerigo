import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";
import { RejectRideRequestDto } from "@application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "@application/dto/driver/RejectRideRequestResponseDto";
import { GetPendingRideRequestsDto } from "@application/dto/driver/GetPendingRideRequestsDto";
import { GetPendingRideRequestsResponseDto } from "@application/dto/driver/GetPendingRideRequestsResponseDto";
import { GetDriverRidesDto } from "@application/dto/driver/GetDriverRidesDto";
import { GetDriverRidesResponseDto } from "@application/dto/driver/GetDriverRidesResponseDto";
import { GetDriverRideByIdDto } from "@application/dto/driver/GetDriverRideByIdDto";
import { GetDriverRideByIdResponseDto } from "@application/dto/driver/GetDriverRideByIdResponseDto";
import { MarkRideAsArrivedDto } from "@application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "@application/dto/driver/MarkRideAsArrivedResponseDto";

@injectable()
export class DriverRideController {
  constructor(
    @inject(TYPES.AcceptRideRequestUseCase)
    private acceptRideRequestUseCase: IUseCase<
      AcceptRideRequestDto,
      Promise<Result<AcceptRideRequestResponseDto>>
    >,
    @inject(TYPES.RejectRideRequestUseCase)
    private rejectRideRequestUseCase: IUseCase<
      RejectRideRequestDto,
      Promise<Result<RejectRideRequestResponseDto>>
    >,
    @inject(TYPES.GetPendingRideRequestsUseCase)
    private getPendingRideRequestsUseCase: IUseCase<
      GetPendingRideRequestsDto,
      Promise<Result<GetPendingRideRequestsResponseDto>>
    >,
    @inject(TYPES.GetDriverRidesUseCase)
    private getDriverRidesUseCase: IUseCase<
      GetDriverRidesDto,
      Promise<Result<GetDriverRidesResponseDto>>
    >,
    @inject(TYPES.GetDriverRideByIdUseCase)
    private getDriverRideByIdUseCase: IUseCase<
      GetDriverRideByIdDto,
      Promise<Result<GetDriverRideByIdResponseDto>>
    >,
    @inject(TYPES.MarkRideAsArrivedUseCase)
    private markRideAsArrivedUseCase: IUseCase<
      MarkRideAsArrivedDto,
      Promise<Result<MarkRideAsArrivedResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async acceptRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const requestId = req.params.requestId;

      if (!requestId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: DRIVER_MESSAGES.REQUEST_ID_REQUIRED,
        });
        return;
      }

      Logger.info("Accept ride request received", {
        userId,
        requestId,
      });

      const dto = AcceptRideRequestDto.fromRequest(userId, { requestId });

      const result = await this.acceptRideRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Accept ride request failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "accept_ride_request",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride request accepted successfully", {
        userId,
        rideId: responseData.data.rideId,
        requestId: responseData.data.requestId,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Accept ride request controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "accept_ride_request",
      );
      res.status(statusCode).json(response);
    }
  }

  async rejectRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const requestId = req.params.requestId;
      if (!requestId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: DRIVER_MESSAGES.REQUEST_ID_REQUIRED,
        });
        return;
      }

      Logger.info("Cancel ride request received", {
        userId,
        requestId,
      });

      const dto = RejectRideRequestDto.fromRequest(userId, {
        requestId,
        reason: req.body?.reason,
      });

      const result = await this.rejectRideRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Cancel ride request failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "cancel_ride_request",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride request cancelled successfully", {
        userId,
        requestId: responseData.data.requestId,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Cancel ride request controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "cancel_ride_request",
      );
      res.status(statusCode).json(response);
    }
  }

  async getPendingRideRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      Logger.info("Get pending ride requests received", {
        userId,
      });

      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string, 10)
        : 0;

      const dto = GetPendingRideRequestsDto.fromRequest(userId, {
        limit,
        offset,
      });

      const result = await this.getPendingRideRequestsUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Get pending ride requests failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_pending_ride_requests",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Pending ride requests fetched successfully", {
        userId,
        count: responseData.data.total,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Get pending ride requests controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_pending_ride_requests",
      );
      res.status(statusCode).json(response);
    }
  }
  async getDriverRides(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      Logger.info("Get driver rides received", {
        userId,
        query: req.query,
      });

      const queryData = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
        status: req.query.status as string | undefined,
        fromDate: req.query.fromDate as string | undefined,
        toDate: req.query.toDate as string | undefined,
      };

      const dto = GetDriverRidesDto.fromRequest(userId, queryData);

      const result = await this.getDriverRidesUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Get driver rides failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_rides",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Driver rides fetched successfully", {
        userId,
        total: responseData.data.pagination.total,
        page: responseData.data.pagination.page,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Get driver rides controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_rides",
      );
      res.status(statusCode).json(response);
    }
  }

  async getDriverRideById(req: Request, res: Response): Promise<void> {
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

      Logger.info("Get driver ride by ID received", {
        userId,
        rideId,
      });

      const dto = GetDriverRideByIdDto.fromRequest(userId, { rideId });

      const result = await this.getDriverRideByIdUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Get driver ride by ID failed", {
          userId,
          rideId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_driver_ride_by_id",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Driver ride fetched successfully", {
        userId,
        rideId: responseData.data.ride.rideId,
        status: responseData.data.ride.status,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Get driver ride by ID controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_driver_ride_by_id",
      );
      res.status(statusCode).json(response);
    }
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
}
