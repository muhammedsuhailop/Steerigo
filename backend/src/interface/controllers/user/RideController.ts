import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { GetUserRideByIdDto } from "@application/dto/user/GetUserRideByIdDto";
import { GetUserRideByIdResponseDto } from "@application/dto/user/GetUserRideByIdResponseDto";
import { USER_MESSAGES } from "@shared/constants/UserMessages";
import { GetUserRidesDto } from "@application/dto/user/GetUserRidesDto";
import { GetUserRidesResponseDto } from "@application/dto/user/GetUserRidesResponseDto";
import { CancelRideDto } from "@application/dto/user/CancelRideDto";
import { CancelRideResponseDto } from "@application/dto/user/CancelRideResponseDto";
import { RateDriverDto } from "@application/dto/user/RateDriverDto";
import { RateDriverResponseDto } from "@application/dto/user/RateDriverResponseDto";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";

@injectable()
export class RideController {
  constructor(
    @inject(TYPES.SendRideRequestUseCase)
    private sendRideRequestUseCase: IUseCase<
      SendRideRequestDto,
      Promise<Result<SendRideRequestResponseDto>>
    >,
    @inject(TYPES.GetUserRideByIdUseCase)
    private getUserRideByIdUseCase: IUseCase<
      GetUserRideByIdDto,
      Promise<Result<GetUserRideByIdResponseDto>>
    >,

    @inject(TYPES.GetUserRidesUseCase)
    private readonly getUserRidesUseCase: IUseCase<
      GetUserRidesDto,
      Promise<Result<GetUserRidesResponseDto>>
    >,

    @inject(TYPES.CancelRideUseCase)
    private readonly cancelRideUseCase: IUseCase<
      CancelRideDto,
      Promise<Result<CancelRideResponseDto>>
    >,

    @inject(TYPES.RateDriverUseCase)
    private readonly rateDriverUseCase: IUseCase<
      RateDriverDto,
      Promise<Result<RateDriverResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async sendRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const riderId = this.getUserId(req);

      const dto = SendRideRequestDto.fromRequest(riderId as string, req.body);

      Logger.info("Send ride request received", {
        riderId,
        driverId: dto.driverId,
        pickupTime: dto.pickupTime,
        rideType: dto.rideType,
        totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
      });

      const result = await this.sendRideRequestUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: responseData.message,
          data: {
            rideRequest: responseData.rideRequest,
          },
        } as ApiResponse);

        Logger.info("Ride request sent successfully", {
          riderId,
          requestId: responseData.rideRequest.requestId,
          driverId: dto.driverId,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);

        Logger.warn("Send ride request failed", {
          riderId,
          driverId: dto.driverId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Send ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async getUserRideById(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const rideId = req.params.rideId;

      Logger.info("Get user ride by ID received", {
        userId,
        rideId,
      });

      const dto = GetUserRideByIdDto.fromRequest(userId as string, { rideId });

      const result = await this.getUserRideByIdUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Get user ride by ID failed", {
          userId,
          rideId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("User ride fetched successfully", {
        userId,
        rideId: responseData.ride.rideId,
        status: responseData.ride.status,
        driverId: responseData.driver.driverId,
      });

      const response: ApiResponse = {
        success: true,
        message: RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
        data: responseData,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Get user ride by ID controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async getUserRides(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      Logger.info("Get user rides received", {
        userId,
        query: req.query,
      });

      const dto = GetUserRidesDto.fromRequest(userId as string, req.query);

      const result = await this.getUserRidesUseCase.execute(dto);

      if (result.isFailure()) {
        Logger.warn("Get user rides failed", {
          userId,
          error: result.getError().message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();

      Logger.info("User rides fetched successfully", {
        userId,
        total: responseData.pagination.total,
        page: responseData.pagination.page,
      });

      const response: ApiResponse = {
        success: true,
        message: RIDE_MESSAGES.RIDES_FETCHED_SUCCESSFULLY,
        data: responseData,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Get user rides controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async cancelRide(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;
      const rideId = req.params.rideId;

      Logger.info("Cancel ride request received from rider", {
        userId,
        rideId,
        body: req.body,
      });

      const dto = CancelRideDto.fromRequest(
        userId,
        { rideId: rideId as string },
        req.body,
      );

      const result = await this.cancelRideUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Cancel ride failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      Logger.info("Ride cancelled successfully", {
        userId,
        rideId: data.rideId,
        feeAmount: data.cancellationFee.amount,
        feeCurrency: data.cancellationFee.currency,
        feeCharged: data.feeCharged,
        addedToArrears: data.addedToArrears,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: data.message,
        data,
      } as ApiResponse);
    } catch (error) {
      Logger.error("Cancel ride controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "cancel_ride",
      );
      res.status(statusCode).json(response);
    }
  }

  async rateDriver(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req) as string;
      const rideId = req.params.rideId;

      Logger.info("Rate driver request received from rider", {
        userId,
        rideId,
        body: req.body,
      });

      const dto = RateDriverDto.fromRequest(
        userId,
        { rideId: rideId as string },
        req.body,
      );

      const result = await this.rateDriverUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Rate driver failed", {
          userId,
          rideId,
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "rate_driver",
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      Logger.info("Driver rated successfully", {
        userId,
        rideId: data.rideId,
        driverId: data.driverId,
        overallRating: data.overallRating,
        averageRating: data.driver.averageRating,
        numberOfRatings: data.driver.numberOfRatings,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: RIDE_MESSAGES.RIDE_RATED,
        data,
      } as ApiResponse);
    } catch (error) {
      Logger.error("Rate driver controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "rate_driver",
      );
      res.status(statusCode).json(response);
    }
  }
}
