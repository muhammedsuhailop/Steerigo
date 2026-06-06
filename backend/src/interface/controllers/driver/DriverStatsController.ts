import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetDriverStatsRequestDto } from "@application/dto/driver/GetDriverStatsRequestDto";
import { GetDriverStatsResponseDto } from "@application/dto/driver/GetDriverStatsResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class DriverStatsController {
  constructor(
    @inject(TYPES.GetDriverStatsUseCase)
    private readonly getDriverStatsUseCase: IUseCase<
      GetDriverStatsRequestDto,
      Promise<Result<GetDriverStatsResponseDto>>
    >,
  ) {}

  async getMyStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const dto = GetDriverStatsRequestDto.fromRequest(
        userId,
        req.query as Record<string, unknown>,
      );

      const result = await this.getDriverStatsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "driver_get_stats",
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: DRIVER_MESSAGES.STATS_FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("DriverStatsController.getMyStats error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }
}
