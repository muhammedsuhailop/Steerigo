import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetAdminPayoutsDto } from "@application/dto/admin/GetAdminPayoutsDto";
import {
  GetPayoutsResponseDto,
  PayoutItemDto,
} from "@application/dto/admin/GetPayoutsResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { Payout } from "@domain/entities/Payout";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetAdminPayoutsUseCase
  implements
    IUseCase<GetAdminPayoutsDto, Promise<Result<GetPayoutsResponseDto>>>
{
  constructor(
    @inject(TYPES.PayoutRepository)
    private readonly payoutRepository: IPayoutRepository,
  ) {}

  async execute(
    dto: GetAdminPayoutsDto,
  ): Promise<Result<GetPayoutsResponseDto>> {
    try {
      Logger.info("Admin fetching payouts", {
        status: dto.getStatus(),
        driverId: dto.getDriverId(),
        page: dto.getPage(),
      });

      const result = await this.payoutRepository.findAllWithFilters({
        status: dto.getStatus(),
        driverId: dto.getDriverId(),
        page: dto.getPage(),
        limit: dto.getLimit(),
        sortBy: dto.getSortBy(),
        sortOrder: dto.getSortOrder(),
      });

      return Result.success({
        payouts: result.payouts.map(this.toPayoutItemDto),
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      Logger.error("Error fetching payouts for admin", {
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
