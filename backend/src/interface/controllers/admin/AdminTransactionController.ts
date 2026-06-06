import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { ApiResponse } from "@shared/types/Common";
import { GetAdminTransactionsDto } from "@application/dto/admin/GetAdminTransactionsDto";
import { GetAdminTransactionsResponseDto } from "@application/dto/admin/GetAdminTransactionsResponseDto";

@injectable()
export class AdminTransactionController {
  constructor(
    @inject(TYPES.GetAdminTransactionsUseCase)
    private readonly getAdminTransactionsUseCase: IUseCase<
      GetAdminTransactionsDto,
      Promise<Result<GetAdminTransactionsResponseDto>>
    >,
  ) {}

  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get transactions request received", {
        query: req.query,
      });

      const dto = GetAdminTransactionsDto.fromRequest(req.query);

      const result = await this.getAdminTransactionsUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get transactions failed", {
          error: error?.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue() as ApiResponse);
    } catch (error) {
      Logger.error("AdminTransactionController.getTransactions error", {
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
