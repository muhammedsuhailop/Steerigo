import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { SendRideRequestUseCase } from "@application/use-cases/user/SendRideRequestUseCase";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class RideController {
  constructor(
    @inject(TYPES.SendRideRequestUseCase)
    private sendRideRequestUseCase: SendRideRequestUseCase
  ) {}

  private getUserId(req: Request): string | null {
    const user = (req as any).user;
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

      const { driverId, pickup, drop, pickupTime, rideType, fare, pickupETA } =
        req.body;

      Logger.info("Send ride request received", {
        riderId,
        driverId,
        pickupTime,
        rideType,
        fare,
      });

      // Create DTO
      const dto = new SendRideRequestDto(
        riderId,
        driverId,
        pickup.latitude,
        pickup.longitude,
        pickup.address,
        drop.latitude,
        drop.longitude,
        drop.address,
        new Date(pickupTime),
        rideType,
        fare,
        pickupETA
      );

      // Execute use case
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
          driverId,
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
          driverId,
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
