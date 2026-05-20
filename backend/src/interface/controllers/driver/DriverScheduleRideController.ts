import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { AcceptFutureRideRequestDto } from "@application/dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "@application/dto/driver/AcceptFutureRideRequestResponseDto";
import { GetFutureRideRequestsDto } from "@application/dto/driver/GetFutureRideRequestsDto";
import { GetFutureRideRequestsResponseDto } from "@application/dto/driver/GetFutureRideRequestsResponseDto";
import { RejectFutureRideRequestDto } from "@application/dto/driver/RejectFutureRideRequestDto";
import { RejectFutureRideRequestResponseDto } from "@application/dto/driver/RejectFutureRideRequestResponseDto";

@injectable()
export class DriverScheduleRideController {
  constructor(
    @inject(TYPES.AcceptFutureRideRequestUseCase)
    private readonly acceptUseCase: IUseCase<
      AcceptFutureRideRequestDto,
      Promise<Result<AcceptFutureRideRequestResponseDto>>
    >,
    @inject(TYPES.GetFutureRideRequestsUseCase)
    private readonly getFutureRideRequestsUseCase: IUseCase<
      GetFutureRideRequestsDto,
      Promise<Result<GetFutureRideRequestsResponseDto>>
    >,
    @inject(TYPES.RejectFutureRideRequestUseCase)
    private readonly rejectUseCase: IUseCase<
      RejectFutureRideRequestDto,
      Promise<Result<RejectFutureRideRequestResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    return req.user?.userId ?? null;
  }

  async getFutureRideRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      Logger.info("Get future ride requests received", {
        userId,
        query: req.query,
      });

      const dto = GetFutureRideRequestsDto.fromRequest(
        userId as string,
        req.query,
      );

      const result = await this.getFutureRideRequestsUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          data: responseData.data,
        } as ApiResponse);

        Logger.info("Get future ride requests successful", {
          userId,
          total: responseData.data.pagination.total,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "GetFutureRideRequests",
        );
        res.status(statusCode).json(response);

        Logger.warn("Get future ride requests failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Get future ride requests controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "GetFutureRideRequests",
      );
      res.status(statusCode).json(response);
    }
  }

  async acceptFutureRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      Logger.info("Accept future ride request received", {
        userId,
        requestId: req.body.requestId,
      });

      const dto = AcceptFutureRideRequestDto.fromRequest(
        userId as string,
        req.body,
      );
      const result = await this.acceptUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          data: responseData.data,
        } as ApiResponse);

        Logger.info("Accept future ride request successful", {
          userId,
          requestId: req.body.requestId,
          requestGroupId: responseData.data.requestGroupId,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "AcceptFutureRideRequest",
        );
        res.status(statusCode).json(response);

        Logger.warn("Accept future ride request failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Accept future ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "AcceptFutureRideRequest",
      );
      res.status(statusCode).json(response);
    }
  }

  async rejectFutureRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      Logger.info("Reject future ride request received", {
        userId,
        requestId: req.body.requestId,
      });

      const dto = RejectFutureRideRequestDto.fromRequest(
        userId as string,
        req.body,
      );
      const result = await this.rejectUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          data: responseData.data,
        } as ApiResponse);

        Logger.info("Reject future ride request successful", {
          userId,
          requestId: req.body.requestId,
          requestGroupId: responseData.data.requestGroupId,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "RejectFutureRideRequest",
        );
        res.status(statusCode).json(response);

        Logger.warn("Reject future ride request failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Reject future ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "RejectFutureRideRequest",
      );
      res.status(statusCode).json(response);
    }
  }
}
