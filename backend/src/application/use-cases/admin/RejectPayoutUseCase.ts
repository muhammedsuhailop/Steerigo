import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RejectPayoutDto } from "@application/dto/admin/RejectPayoutDto";
import { RejectPayoutResponseDto } from "@application/dto/admin/RejectPayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PayoutErrors } from "@domain/errors/PayoutErrors";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";

@injectable()
export class RejectPayoutUseCase
  implements IUseCase<RejectPayoutDto, Promise<Result<RejectPayoutResponseDto>>>
{
  constructor(
    @inject(TYPES.PayoutRepository)
    private readonly payoutRepository: IPayoutRepository,
  ) {}

  async execute(
    dto: RejectPayoutDto,
  ): Promise<Result<RejectPayoutResponseDto>> {
    const payoutId = dto.getPayoutId();

    try {
      Logger.info("Rejecting payout", { payoutId, adminId: dto.getAdminId() });

      const payout = await this.payoutRepository.findById(payoutId);
      if (!payout) {
        return Result.failure(PayoutErrors.payoutNotFound(payoutId));
      }

      if (payout.getStatus() !== PayoutStatus.REQUESTED) {
        return Result.failure(PayoutErrors.payoutNotRequested(payoutId));
      }

      payout.markFailed(dto.getReason());
      const savedPayout = await this.payoutRepository.save(payout);

      Logger.info("Payout rejected", {
        payoutId,
        driverId: savedPayout.getDriverId(),
        reason: dto.getReason(),
      });

      return Result.success({
        success: true,
        message: ADMIN_MESSAGES.PAYOUT.REJECTED,
        data: {
          payoutId: savedPayout.getId(),
          driverId: savedPayout.getDriverId(),
          status: savedPayout.getStatus(),
          failureReason: dto.getReason(),
        },
      });
    } catch (error) {
      Logger.error("Error rejecting payout", {
        payoutId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
