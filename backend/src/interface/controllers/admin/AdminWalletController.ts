import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { GetAdminWalletDto } from "@application/dto/admin/GetAdminWalletDto";
import { GetAdminWalletResponseDto } from "@application/dto/admin/GetAdminWalletResponseDto";
import { ApiResponse } from "@shared/types/Common";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";

@injectable()
export class AdminWalletController {
  constructor(
    @inject(TYPES.GetAdminWalletUseCase)
    private readonly getAdminWalletUseCase: IUseCase<
      GetAdminWalletDto,
      Promise<Result<GetAdminWalletResponseDto>>
    >,
  ) {}

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get wallet request received", { query: req.query });

      const dto = GetAdminWalletDto.fromRequest(req.query);
      const result = await this.getAdminWalletUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get wallet failed", { error: error?.message });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: ADMIN_MESSAGES.WALLET.FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("AdminWalletController.getWallet error", {
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
