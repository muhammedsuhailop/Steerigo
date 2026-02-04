import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";

@injectable()
export class DriverRideController {
  constructor(
    @inject(TYPES.AcceptRideRequestUseCase)
    private acceptRideRequestUseCase: IUseCase<
      AcceptRideRequestDto,
      Promise<Result<AcceptRideRequestResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async acceptRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: DRIVER_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const requestId = req.params.requestId;

      if (!requestId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: DRIVER_MESSAGES.REQUEST_ID_REQUIRED,
        });
        return;
      }

      Logger.info("Accept ride request received", {
        userId,
        requestId,
      });

      const dto = AcceptRideRequestDto.fromRequest(userId, { requestId });

      const result = await this.acceptRideRequestUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        Logger.warn("Accept ride request failed", {
          userId,
          error: error.message,
        });

        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "accept_ride_request",
        );
        res.status(statusCode).json(response);
        return;
      }

      const responseData = result.getValue();
      Logger.info("Ride request accepted successfully", {
        userId,
        rideId: responseData.data.rideId,
        requestId: responseData.data.requestId,
      });

      res.status(HttpStatusCodes.OK).json(responseData);
    } catch (error) {
      Logger.error("Accept ride request controller error", {
        userId: this.getUserId(req),
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "accept_ride_request",
      );
      res.status(statusCode).json(response);
    }
  }
}
