import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { USER_MESSAGES } from "@shared/constants/UserMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { FindNearbyDriversResponseDto } from "@application/dto/user/FindNearbyDriversResponseDto";
import { Result } from "@shared/utils/Result";

@injectable()
export class DriverSearchController {
  constructor(
    @inject(TYPES.FindNearbyDriversUseCase)
    private findNearbyDriversUseCase: IUseCase<
      FindNearbyDriversRequestDto,
      Promise<Result<FindNearbyDriversResponseDto>>
    >
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async findNearbyDrivers(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: USER_MESSAGES.DRIVER_SEARCH.UNAUTHORIZED,
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
        limit,
      } = req.body;

      Logger.info("Find nearby drivers request received", {
        userId,
        latitude,
        longitude,
        searchDate,
        radiusKm,
        timeRequired,
        gearType,
        bodyType,
      });

      const dto = new FindNearbyDriversRequestDto(
        latitude,
        longitude,
        searchDate ? new Date(searchDate) : new Date(),
        timeRequired,
        radiusKm || 10,
        gearType || "",
        bodyType || "",
        limit || 20
      );

      const result = await this.findNearbyDriversUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        const count = responseData.drivers.length;

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message:
            count > 0
              ? USER_MESSAGES.DRIVER_SEARCH.FOUND_DRIVERS(count)
              : USER_MESSAGES.DRIVER_SEARCH.NO_DRIVERS_FOUND,
          data: {
            drivers: responseData.drivers,
            estimatedFare: responseData.estimatedFare?.toJSON(),
            summary: {
              totalFound: responseData.totalFound,
              searchedAt: responseData.searchedAt,
              searchCriteria: responseData.searchCriteria,
            },
          },
        } as ApiResponse);

        Logger.info("Find nearby drivers request successful", {
          userId,
          driversFound: count,
        });
      } else {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "FindNearbyDrivers"
        );

        res.status(statusCode).json(response);

        Logger.warn("Find nearby drivers request failed", {
          userId,
          error: error?.message,
        });
      }
    } catch (error) {
      Logger.error("Find nearby drivers controller error", {
        error,
        userId: this.getUserId(req),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "FindNearbyDrivers"
      );

      res.status(statusCode).json(response);
    }
  }
}
