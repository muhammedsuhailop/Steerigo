import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AutoSearchAndRequestDto } from "@application/dto/user/AutoSearchAndRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { AutoSearchAndRequestResponseDto } from "@application/dto/user/AutoSearchAndRequestResponseDto";
import { Result } from "@shared/utils/Result";

@injectable()
export class AutoRideController {
  constructor(
    @inject(TYPES.AutoSearchAndSendRideRequestUseCase)
    private autoSearchAndSendUseCase: IUseCase<
      AutoSearchAndRequestDto,
      Promise<Result<AutoSearchAndRequestResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async autoSearchAndSendRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required",
        } as ApiResponse);
        return;
      }

      const {
        latitude,
        longitude,
        searchDate,
        timeRequired,
        radiusKm,
        gearType,
        bodyType,
        maxRideRequests,
        dropLatitude,
        dropLongitude,
        dropAddress,
        pickupAddress,
        rideType,
      } = req.body;

      Logger.info("Auto search and send ride request received", {
        userId,
        latitude,
        longitude,
        searchDate,
        radiusKm,
        timeRequired,
        gearType,
        bodyType,
        maxRideRequests,
      });

      const dto = AutoSearchAndRequestDto.fromRequest(userId, req.body);

      const result = await this.autoSearchAndSendUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          requestGroupId: responseData.result.requestGroupId,
          data: {
            successfulRequests: responseData.result.successfulRequests,
            failedRequests: responseData.result.failedRequests,
            summary: {
              totalDriversFound: responseData.result.totalDriversFound,
              successCount: responseData.result.successCount,
              failureCount: responseData.result.failureCount,
              searchedAt: responseData.result.searchedAt,
            },
          },
        } as ApiResponse);

        Logger.info("Auto search and send ride request successful", {
          userId,
          successCount: responseData.result.successCount,
          failureCount: responseData.result.failureCount,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "AutoSearchAndSendRideRequest",
        );

        res.status(statusCode).json(response);

        Logger.warn("Auto search and send ride request failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Auto search and send ride request controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "AutoSearchAndSendRideRequest",
      );

      res.status(statusCode).json(response);
    }
  }
}
