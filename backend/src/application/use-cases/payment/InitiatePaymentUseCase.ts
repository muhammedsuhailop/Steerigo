import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { InitiatePaymentDto } from "@application/dto/payment/InitiatePaymentDto";
import {
  InitiatePaymentResponseDto,
  OnlinePaymentInitData,
  WalletPaymentInitData,
  CashPaymentInitData,
} from "@application/dto/payment/InitiatePaymentResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IPaymentGatewayService } from "@application/services/IPaymentGatewayService";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { Ride } from "@domain/entities/Ride";
import { Payment } from "@domain/entities/Payment";
import { Transaction } from "@domain/entities/Transaction";
import { Money } from "@domain/value-objects/Money";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { RideErrors } from "@domain/errors/RideErrors";
import { Types } from "mongoose";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";

@injectable()
export class InitiatePaymentUseCase
  implements
    IUseCase<InitiatePaymentDto, Promise<Result<InitiatePaymentResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(TYPES.PaymentGatewayService)
    private readonly paymentGatewayService: IPaymentGatewayService,
    @inject(TYPES.EarningsDistributionService)
    private readonly earningsDistributionService: IEarningsDistributionService,
  ) {}

  async execute(
    dto: InitiatePaymentDto,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const rideId = dto.getRideId();
    const method = dto.getMethod();
    const userId = dto.getUserId();

    try {
      Logger.info("Initiating payment", { userId, rideId, method });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      if (!ride.isCompleted()) {
        return Result.failure(PaymentErrors.rideNotCompleted(rideId));
      }

      if (ride.getRiderId() !== userId) {
        return Result.failure(PaymentErrors.unauthorizedPaymentAccess(rideId));
      }

      const existingPayment = await this.paymentRepository.findByRideId(rideId);
      if (existingPayment) {
        return Result.failure(PaymentErrors.paymentAlreadyExists(rideId));
      }

      const now = new Date();
      ride.getTimeline().setPaymentInitiatedAt(now);

      const amount = Money.create(ride.getFare(), ride.getCurrency());
      const paymentId = new Types.ObjectId().toString();

      const payment = Payment.create(
        paymentId,
        rideId,
        ride.getRiderId(),
        ride.getDriverId(),
        amount,
        method,
        { initiatedBy: userId },
      );

      if (method === PaymentMethod.ONLINE) {
        return this.handleOnlinePayment(payment, amount, ride);
      }

      if (method === PaymentMethod.WALLET) {
        return this.handleWalletPayment(payment, amount, userId, ride);
      }

      if (method === PaymentMethod.CASH) {
        return this.handleCashPayment(payment, amount, ride);
      }

      return Result.failure(PaymentErrors.invalidPaymentMethod(method));
    } catch (error) {
      Logger.error("Error initiating payment", {
        userId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private async handleOnlinePayment(
    payment: Payment,
    amount: Money,
    ride: Ride,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const rideId = ride.getRideId();
    const order = await this.paymentGatewayService.createOrder({
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
      receipt: `ride_${rideId}`,
      notes: { rideId },
    });

    payment.attachGatewayIds({
      gateway: "razorpay",
      gatewayOrderId: order.gatewayOrderId,
    });

    await this.paymentRepository.save(payment);
    await this.rideRepository.save(ride);

    Logger.info("Razorpay order created & timeline updated", {
      paymentId: payment.getId(),
      rideId,
    });

    const data: OnlinePaymentInitData = {
      paymentId: payment.getId(),
      gatewayOrderId: order.gatewayOrderId,
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
      gateway: "razorpay",
    };

    return Result.success({
      success: true,
      message: PAYMENT_MESSAGES.ONLINE_ORDER_CREATED,
      method: PaymentMethod.ONLINE,
      data,
    });
  }

  private async handleWalletPayment(
    payment: Payment,
    amount: Money,
    userId: string,
    ride: Ride,
  ): Promise<Result<InitiatePaymentResponseDto>> {
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
    await this.earningsDistributionService
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

    const data: WalletPaymentInitData = {
      paymentId: payment.getId(),
      status: payment.getStatus(),
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
      walletBalanceAfter: wallet.getAvailableBalance().getAmount(),
    };

    return Result.success({
      success: true,
      message: PAYMENT_MESSAGES.WALLET_PAYMENT_SUCCESS,
      method: PaymentMethod.WALLET,
      data,
    });
  }

  private async handleCashPayment(
    payment: Payment,
    amount: Money,
    ride: Ride,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    await this.paymentRepository.save(payment);
    await this.rideRepository.save(ride);

    Logger.info("Cash payment initiated & timeline updated", {
      paymentId: payment.getId(),
      rideId: ride.getRideId(),
    });

    const data: CashPaymentInitData = {
      paymentId: payment.getId(),
      status: payment.getStatus(),
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
    };

    return Result.success({
      success: true,
      message: PAYMENT_MESSAGES.CASH_PAYMENT_INITIATED,
      method: PaymentMethod.CASH,
      data,
    });
  }
}
