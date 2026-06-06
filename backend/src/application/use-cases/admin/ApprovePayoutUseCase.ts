import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { ApprovePayoutDto } from "@application/dto/admin/ApprovePayoutDto";
import { ApprovePayoutResponseDto } from "@application/dto/admin/ApprovePayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { Transaction } from "@domain/entities/Transaction";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PayoutErrors } from "@domain/errors/PayoutErrors";
import { Types } from "mongoose";
import { ADMIN_ERROR_MESSAGES } from "@shared/constants/AdminMessages";

@injectable()
export class ApprovePayoutUseCase
  implements
    IUseCase<ApprovePayoutDto, Promise<Result<ApprovePayoutResponseDto>>>
{
  constructor(
    @inject(TYPES.PayoutRepository)
    private readonly payoutRepository: IPayoutRepository,
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    dto: ApprovePayoutDto,
  ): Promise<Result<ApprovePayoutResponseDto>> {
    const payoutId = dto.getPayoutId();

    try {
      Logger.info("Approving payout", { payoutId, adminId: dto.getAdminId() });

      const payout = await this.payoutRepository.findById(payoutId);
      if (!payout) {
        return Result.failure(PayoutErrors.payoutNotFound(payoutId));
      }

      if (payout.getStatus() !== PayoutStatus.REQUESTED) {
        return Result.failure(PayoutErrors.payoutNotRequested(payoutId));
      }

      const driverId = payout.getDriverId();
      const wallet = await this.walletRepository.findByOwner(
        driverId,
        WalletOwnerType.DRIVER,
      );
      if (!wallet) {
        return Result.failure(PayoutErrors.driverWalletNotFound(driverId));
      }

      const payoutAmount = payout.getAmount();

      if (wallet.getAvailableBalance().getAmount() < payoutAmount.getAmount()) {
        return Result.failure(
          PayoutErrors.insufficientDriverBalance(
            wallet.getAvailableBalance().getAmount().toString(),
            payoutAmount.getAmount().toString(),
          ),
        );
      }

      payout.markProcessing();
      await this.payoutRepository.save(payout);

      try {
        wallet.debit(payoutAmount);
        await this.walletRepository.save(wallet);

        const transaction = Transaction.create({
          id: new Types.ObjectId().toString(),
          walletId: wallet.getId(),
          type: TransactionType.PAYOUT,
          direction: TransactionDirection.DEBIT,
          amount: payoutAmount,
          relatedEntityId: payoutId,
          relatedEntityType: "Payout",
          note: `Payout withdrawal for driver ${driverId}`,
        });

        await this.transactionRepository.save(transaction);

        const processedAt = new Date();
        payout.markCompleted(processedAt);
        const savedPayout = await this.payoutRepository.save(payout);

        Logger.info("Payout approved and completed", {
          payoutId,
          driverId,
          amount: payoutAmount.getAmount(),
          walletBalanceAfter: wallet.getAvailableBalance().getAmount(),
        });

        return Result.success({
          payoutId: savedPayout.getId(),
          driverId,
          amount: payoutAmount.getAmount(),
          currency: savedPayout.getCurrency(),
          status: savedPayout.getStatus(),
          processedAt: processedAt.toISOString(),
          driverWalletBalanceAfter: wallet.getAvailableBalance().getAmount(),
        });
      } catch (innerError) {
        payout.markFailed(
          innerError instanceof Error
            ? innerError.message
            : ADMIN_ERROR_MESSAGES.PAYOUT.WALLET_DEBIT_FAILED_ON_APPROVAL,
        );
        await this.payoutRepository.save(payout);

        Logger.error("Payout approval failed at wallet debit stage", {
          payoutId,
          driverId,
          error:
            innerError instanceof Error
              ? innerError.message
              : String(innerError),
        });

        return Result.failure(innerError as Error);
      }
    } catch (error) {
      Logger.error("Error approving payout", {
        payoutId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
