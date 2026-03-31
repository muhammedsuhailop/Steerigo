import { injectable, inject } from "inversify";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { CashPaymentInitData } from "@application/dto/payment/InitiatePaymentResponseDto";
import {
  IPaymentStrategy,
  PaymentStrategyParams,
} from "@application/services/payment/IPaymentStrategy";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class CashPaymentStrategy
  implements IPaymentStrategy<CashPaymentInitData>
{
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,

    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
  ) {}

  getMethod(): PaymentMethod {
    return PaymentMethod.CASH;
  }

  getSuccessMessage(): string {
    return PAYMENT_MESSAGES.CASH_PAYMENT_INITIATED;
  }

  async execute({
    payment,
    ride,
  }: PaymentStrategyParams): Promise<Result<CashPaymentInitData>> {
    await this.paymentRepository.save(payment);
    await this.rideRepository.save(ride);

    Logger.info("Cash payment initiated", {
      paymentId: payment.getId(),
      rideId: ride.getRideId(),
    });

    return Result.success({
      paymentId: payment.getId(),
      status: payment.getStatus(),
      amount: payment.getAmount().getAmount(),
      currency: payment.getAmount().getCurrency(),
    });
  }
}
