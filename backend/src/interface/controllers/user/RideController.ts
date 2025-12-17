import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";

@injectable()
export class RideController {
  constructor(
    @inject(TYPES.SendRideRequestUseCase)
    private sendRideRequestUseCase: IUseCase<
      SendRideRequestDto,
      Promise<Result<SendRideRequestResponseDto>>
    >
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async sendRideRequest(req: Request, res: Response): Promise<void> {
    try {
      const riderId = this.getUserId(req);
      if (!riderId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: User ID not found in request",
        } as ApiResponse);
        return;
      }

      const dto = SendRideRequestDto.fromRequest(riderId, req.body);

      Logger.info("Send ride request received", {
        riderId,
        driverId: dto.driverId,
        pickupTime: dto.pickupTime,
        rideType: dto.rideType,
        totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
      });

      const result = await this.sendRideRequestUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.CREATED).json({
          success: true,
          message: responseData.message,
          data: {
            rideRequest: responseData.rideRequest,
          },
        } as ApiResponse);

        Logger.info("Ride request sent successfully", {
          riderId,
          requestId: responseData.rideRequest.requestId,
          driverId: dto.driverId,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "SendRideRequest"
        );
        res.status(statusCode).json(response);

        Logger.warn("Send ride request failed", {
          riderId,
          driverId: dto.driverId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Send ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "SendRideRequest"
      );
      res.status(statusCode).json(response);
    }
  }
}
