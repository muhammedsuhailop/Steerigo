import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { Transaction } from "@domain/entities/Transaction";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { Logger } from "@shared/utils/Logger";
import { WalletPaymentInitData } from "@application/dto/payment/InitiatePaymentResponseDto";
import {
  IPaymentStrategy,
  PaymentStrategyParams,
} from "@application/services/payment/IPaymentStrategy";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";

@injectable()
export class WalletPaymentStrategy
  implements IPaymentStrategy<WalletPaymentInitData>
{
  constructor(
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.EarningsDistributionService)
    private readonly earningsService: IEarningsDistributionService,
  ) {}

  getMethod(): PaymentMethod {
    return PaymentMethod.WALLET;
  }

  getSuccessMessage(): string {
    return PAYMENT_MESSAGES.WALLET_PAYMENT_SUCCESS;
  }

  async execute({
    payment,
    ride,
    amount,
    userId,
  }: PaymentStrategyParams): Promise<Result<WalletPaymentInitData>> {
    const rideId = ride.getRideId();
    const now = new Date();

    const wallet = await this.walletRepository.findByOwner(
      userId,
      WalletOwnerType.RIDER,
    );
    if (!wallet) return Result.failure(PaymentErrors.walletNotFound(userId));

    if (wallet.getAvailableBalance().getAmount() < amount.getAmount()) {
      return Result.failure(
        PaymentErrors.insufficientWalletBalance(
          wallet.getAvailableBalance().getAmount().toString(),
          amount.getAmount().toString(),
        ),
      );
    }

    wallet.debit(amount);
    await this.walletRepository.save(wallet);

    const riderTransaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: TransactionType.RIDE_PAYMENT,
      direction: TransactionDirection.DEBIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: `Payment for ride ${rideId}`,
    });
    await this.transactionRepository.save(riderTransaction);

    payment.markSuccess(undefined, now);
    await this.paymentRepository.save(payment);

    ride.getTimeline().setPaymentCompletedAt(now);
    ride.updatePaymentStatus(PaymentStatus.SUCCESS);
    await this.rideRepository.save(ride);

    const fareBreakdown = ride.getFareBreakdown();
    await this.earningsService
      .distribute({
        rideId,
        driverId: ride.getDriverId(),
        totalFare: fareBreakdown.getTotalFare(),
        platformFee: fareBreakdown.getPlatformFee(),
        platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
      })
      .catch((err) =>
        Logger.error("Distribution failed", { rideId, error: err.message }),
      );

    return Result.success({
      paymentId: payment.getId(),
      status: payment.getStatus(),
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
      walletBalanceAfter: wallet.getAvailableBalance().getAmount(),
    });
  }
}
