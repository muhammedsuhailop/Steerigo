import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverPayoutsDto } from "@application/dto/driver/GetDriverPayoutsDto";
import {
  GetPayoutsResponseDto,
  PayoutItemDto,
} from "@application/dto/driver/GetPayoutsResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Payout } from "@domain/entities/Payout";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { DRIVER_MESSAGES } from "@shared/constants/DriverMessages";

@injectable()
export class GetDriverPayoutsUseCase
  implements
    IUseCase<GetDriverPayoutsDto, Promise<Result<GetPayoutsResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.PayoutRepository)
    private readonly payoutRepository: IPayoutRepository,
  ) {}

  async execute(
    dto: GetDriverPayoutsDto,
  ): Promise<Result<GetPayoutsResponseDto>> {
    try {
      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();
      const payouts = await this.payoutRepository.findByDriverId(driverId);

      Logger.info("Retrieved driver payouts", {
        driverId,
        count: payouts.length,
      });

      return Result.success({
        success: true,
        message: DRIVER_MESSAGES.PAYOUT_RETRIVED,
        data: {
          payouts: payouts.map(this.toPayoutItemDto),
          total: payouts.length,
          page: 1,
          limit: payouts.length,
        },
      });
    } catch (error) {
      Logger.error("Error fetching driver payouts", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private toPayoutItemDto(payout: Payout): PayoutItemDto {
    return {
      payoutId: payout.getId(),
      driverId: payout.getDriverId(),
      amount: payout.getAmount().getAmount(),
      currency: payout.getCurrency(),
      method: payout.getMethod(),
      status: payout.getStatus(),
      destination: payout.getDestination(),
      failureReason: payout.getFailureReason(),
      createdAt: payout.getCreatedAt().toISOString(),
      processedAt: payout.getProcessedAt()?.toISOString(),
      updatedAt: payout.getUpdatedAt().toISOString(),
    };
  }
}
