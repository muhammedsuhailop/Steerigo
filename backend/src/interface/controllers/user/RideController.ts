import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { SendRideRequestUseCase } from "@application/use-cases/user/SendRideRequestUseCase";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
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

      const {
        driverId,
        pickup,
        drop,
        pickupTime,
        rideType,
        fareBreakdown: fareBreakdownData, 
        pickupETA,
      } = req.body;

      Logger.info("Send ride request received", {
        riderId,
        driverId,
        pickupTime,
        rideType,
        totalFare: fareBreakdownData?.totalFare?.amount,
      });

      const baseFare = Money.create(
        fareBreakdownData.baseFare.amount,
        fareBreakdownData.baseFare.currency
      );

      const platformFee = Money.create(
        fareBreakdownData.platformFee.amount,
        fareBreakdownData.platformFee.currency
      );

      const fareTax: TaxBreakdown = {
        name: fareBreakdownData.taxes.fare.name,
        rate: fareBreakdownData.taxes.fare.rate,
        amount: Money.create(
          fareBreakdownData.taxes.fare.amount.amount,
          fareBreakdownData.taxes.fare.amount.currency
        ),
      };

      const platformFeeTax: TaxBreakdown = {
        name: fareBreakdownData.taxes.platformFee.name,
        rate: fareBreakdownData.taxes.platformFee.rate,
        amount: Money.create(
          fareBreakdownData.taxes.platformFee.amount.amount,
          fareBreakdownData.taxes.platformFee.amount.currency
        ),
      };

      const totalFare = Money.create(
        fareBreakdownData.totalFare.amount,
        fareBreakdownData.totalFare.currency
      );

      const fareBreakdown = FareBreakdown.create({
        baseFare,
        platformFee,
        fareTax,
        platformFeeTax,
        totalFare,
        durationHours: fareBreakdownData.durationHours,
      });

      // Create DTO with fareBreakdown
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
        fareBreakdown, 
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
