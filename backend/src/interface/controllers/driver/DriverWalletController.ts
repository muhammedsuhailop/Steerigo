import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetDriverWalletDto } from "@application/dto/driver/GetDriverWalletDto";
import { GetDriverWalletResponseDto } from "@application/dto/driver/GetDriverWalletResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class DriverWalletController {
  constructor(
    @inject(TYPES.GetDriverWalletUseCase)
    private readonly getDriverWalletUseCase: IUseCase<
      GetDriverWalletDto,
      Promise<Result<GetDriverWalletResponseDto>>
    >,
  ) {}

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      Logger.info("Driver wallet fetch request received", {
        userId,
        query: req.query,
      });

      const dto = GetDriverWalletDto.fromRequest(userId as string, req.query);
      const result = await this.getDriverWalletUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Driver wallet fetch failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);

        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: DRIVER_MESSAGES.WALLET_FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Driver wallet controller error", {
        userId: req.user?.userId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
