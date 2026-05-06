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

@injectable()
export class AdminStatsController {
  constructor(
    @inject(TYPES.GetAdminUserStatsUseCase)
    private readonly getAdminUserStatsUseCase: IUseCase<
      GetUserStatsRequestDto,
      Promise<Result<GetUserStatsResponseDto>>
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
          "get_user_stats",
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

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_user_stats",
      );

      res.status(statusCode).json(response);
    }
  }
}
