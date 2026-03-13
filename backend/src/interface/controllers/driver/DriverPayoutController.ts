import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { RequestPayoutDto } from "@application/dto/driver/RequestPayoutDto";
import { RequestPayoutResponseDto } from "@application/dto/driver/RequestPayoutResponseDto";
import { GetDriverPayoutsDto } from "@application/dto/driver/GetDriverPayoutsDto";
import { GetPayoutsResponseDto } from "@application/dto/driver/GetPayoutsResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class DriverPayoutController {
  constructor(
    @inject(TYPES.RequestPayoutUseCase)
    private readonly requestPayoutUseCase: IUseCase<
      RequestPayoutDto,
      Promise<Result<RequestPayoutResponseDto>>
    >,

    @inject(TYPES.GetDriverPayoutsUseCase)
    private readonly getDriverPayoutsUseCase: IUseCase<
      GetDriverPayoutsDto,
      Promise<Result<GetPayoutsResponseDto>>
    >,
  ) {}

  async requestPayout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { amount, method, destination } = req.body;

      const dto = RequestPayoutDto.create({
        userId,
        amount,
        method,
        destination,
      });

      const result = await this.requestPayoutUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "driver_request_payout",
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.CREATED).json(result.getValue());
    } catch (error) {
      Logger.error("DriverPayoutController.requestPayout error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "driver_request_payout",
      );

      res.status(statusCode).json(response);
    }
  }

  async getMyPayouts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const dto = GetDriverPayoutsDto.create(userId);

      const result = await this.getDriverPayoutsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "driver_get_payouts",
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("DriverPayoutController.getMyPayouts error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "driver_get_payouts",
      );

      res.status(statusCode).json(response);
    }
  }
}
