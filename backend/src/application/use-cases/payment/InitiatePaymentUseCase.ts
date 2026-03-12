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

const PAYMENT_MESSAGES = {
  ONLINE_ORDER_CREATED:
    "Payment order created. Complete payment using the gateway.",
  WALLET_PAYMENT_SUCCESS: "Wallet payment processed successfully.",
  CASH_PAYMENT_INITIATED:
    "Cash payment initiated. Driver will collect payment.",
};

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
  ) {}

  async execute(
    dto: InitiatePaymentDto,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const { rideId, method, userId } = {
      rideId: dto.getRideId(),
      method: dto.getMethod(),
      userId: dto.getUserId(),
    };

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
        return this.handleOnlinePayment(payment, amount, rideId);
      }

      if (method === PaymentMethod.WALLET) {
        return this.handleWalletPayment(payment, amount, userId, rideId, ride);
      }

      if (method === PaymentMethod.CASH) {
        return this.handleCashPayment(payment, amount, rideId);
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
    rideId: string,
  ): Promise<Result<InitiatePaymentResponseDto>> {
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

    const savedPayment = await this.paymentRepository.save(payment);

    Logger.info("Razorpay order created", {
      paymentId: savedPayment.getId(),
      gatewayOrderId: order.gatewayOrderId,
    });

    const data: OnlinePaymentInitData = {
      paymentId: savedPayment.getId(),
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
    rideId: string,
    ride: {
      updatePaymentStatus: (status: PaymentStatus) => void;
      getRideId: () => string;
    },
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const wallet = await this.walletRepository.findByOwner(
      userId,
      WalletOwnerType.RIDER,
    );

    if (!wallet) {
      return Result.failure(PaymentErrors.walletNotFound(userId));
    }

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

    const transaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: TransactionType.RIDE_PAYMENT,
      direction: TransactionDirection.DEBIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: `Payment for ride ${rideId}`,
    });

    await this.transactionRepository.save(transaction);

    payment.markSuccess(undefined, new Date());
    const savedPayment = await this.paymentRepository.save(payment);

    Logger.info("Wallet payment processed", {
      paymentId: savedPayment.getId(),
      userId,
      rideId,
    });

    const data: WalletPaymentInitData = {
      paymentId: savedPayment.getId(),
      status: savedPayment.getStatus(),
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
    rideId: string,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const savedPayment = await this.paymentRepository.save(payment);

    Logger.info("Cash payment initiated", {
      paymentId: savedPayment.getId(),
      rideId,
    });

    const data: CashPaymentInitData = {
      paymentId: savedPayment.getId(),
      status: savedPayment.getStatus(),
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
