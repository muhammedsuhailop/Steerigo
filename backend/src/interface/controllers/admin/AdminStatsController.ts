import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetUserStatsRequestDto } from "@application/dto/admin/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/admin/GetUserStatsResponseDto";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { ApiResponse } from "@shared/types/Common";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";
import { GetAdminRideStatsRequestDto } from "@application/dto/admin/GetAdminRideStatsRequestDto";
import { GetAdminRideStatsResponseDto } from "@application/dto/admin/GetAdminRideStatsResponseDto";
import { GetAdminDriverStatsRequestDto } from "@application/dto/admin/GetAdminDriverStatsRequestDto";
import { GetAdminDriverStatsResponseDto } from "@application/dto/admin/GetAdminDriverStatsResponseDto";

@injectable()
export class AdminStatsController {
  constructor(
    @inject(TYPES.GetAdminUserStatsUseCase)
    private readonly getAdminUserStatsUseCase: IUseCase<
      GetUserStatsRequestDto,
      Promise<Result<GetUserStatsResponseDto>>
    >,

    @inject(TYPES.GetAdminRideStatsUseCase)
    private readonly getAdminRideStatsUseCase: IUseCase<
      GetAdminRideStatsRequestDto,
      Promise<Result<GetAdminRideStatsResponseDto>>
    >,

    @inject(TYPES.GetAdminDriverStatsUseCase)
    private readonly getAdminDriverStatsUseCase: IUseCase<
      GetAdminDriverStatsRequestDto,
      Promise<Result<GetAdminDriverStatsResponseDto>>
    >,
  ) {}

  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get user stats request received", {
        query: req.query,
      });

      const dto = GetUserStatsRequestDto.fromRequest(req.query);

      const result = await this.getAdminUserStatsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      const response: ApiResponse<GetUserStatsResponseDto> = {
        success: true,
        message: ADMIN_MESSAGES.STATS.USER_FETCHED,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("AdminStatsController.getUserStats error", {
        error,
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async getRideStats(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get ride stats request received", {
        query: req.query,
      });

      const dto = GetAdminRideStatsRequestDto.fromRequest(
        req.query as Record<string, unknown>,
      );

      const result = await this.getAdminRideStatsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();

      const response: ApiResponse<GetAdminRideStatsResponseDto> = {
        success: true,
        message: ADMIN_MESSAGES.STATS.RIDE_FETCHED,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("AdminStatsController.getRideStats error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async getDriverStats(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get driver stats request received", {
        query: req.query,
      });

      const dto = GetAdminDriverStatsRequestDto.fromRequest(
        req.query as Record<string, unknown>,
      );
      const result = await this.getAdminDriverStatsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse<GetAdminDriverStatsResponseDto> = {
        success: true,
        message: ADMIN_MESSAGES.STATS.DRIVER_FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("AdminStatsController.getDriverStats error", { error });
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
