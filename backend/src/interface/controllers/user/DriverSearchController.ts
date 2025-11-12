import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { FindNearbyDriversUseCase } from "@application/use-cases/user/FindNearbyDriversUseCase";
import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class DriverSearchController {
  constructor(
    @inject(TYPES.FindNearbyDriversUseCase)
    private findNearbyDriversUseCase: FindNearbyDriversUseCase
  ) {}

  private getUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.userId ?? null;
  }

  async findNearbyDrivers(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: User not authenticated",
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
        new Date(searchDate),
        timeRequired,
        radiusKm || 10,
        gearType || "",
        bodyType || "",
        limit || 20
      );

      const result = await this.findNearbyDriversUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();

        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: `Found ${responseData.drivers.length} available drivers`,
          data: {
            drivers: responseData.drivers,
            summary: {
              totalFound: responseData.totalFound,
              searchedAt: responseData.searchedAt,
              searchCriteria: responseData.searchCriteria,
            },
          },
        } as ApiResponse);

        Logger.info("Find nearby drivers request successful", {
          userId,
          driversFound: responseData.drivers.length,
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
          error: error.message,
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
