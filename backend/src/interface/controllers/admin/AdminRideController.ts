import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetAdminRidesDto } from "@application/dto/admin/GetAdminRidesDto";
import { GetAdminRidesResponseDto } from "@application/dto/admin/GetAdminRidesResponseDto";
import { Result } from "@shared/utils/Result";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

@injectable()
export class AdminRideController {
  constructor(
    @inject(TYPES.GetAdminRidesUseCase)
    private readonly getAdminRidesUseCase: IUseCase<
      GetAdminRidesDto,
      Promise<Result<GetAdminRidesResponseDto>>
    >,
  ) {}

  async getRides(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get rides received", { query: req.query });

      const dto = GetAdminRidesDto.fromRequest(req.query);
      const result = await this.getAdminRidesUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Admin get rides failed", { error: error.message });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "admin_get_rides",
        );
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("Admin get rides controller error", {
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "admin_get_rides",
      );
      res.status(statusCode).json(response);
    }
  }
}
