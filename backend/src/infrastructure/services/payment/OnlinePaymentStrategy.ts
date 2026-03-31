import { injectable, inject } from "inversify";
import { IPaymentGatewayService } from "@application/services/IPaymentGatewayService";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { OnlinePaymentInitData } from "@application/dto/payment/InitiatePaymentResponseDto";
import {
  IPaymentStrategy,
  PaymentStrategyParams,
} from "@application/services/payment/IPaymentStrategy";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";

@injectable()
export class OnlinePaymentStrategy
  implements IPaymentStrategy<OnlinePaymentInitData>
{
  constructor(
    @inject(TYPES.PaymentGatewayService)
    private readonly paymentGatewayService: IPaymentGatewayService,
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
  ) {}

  getMethod(): PaymentMethod {
    return PaymentMethod.ONLINE;
  }

  getSuccessMessage(): string {
    return PAYMENT_MESSAGES.ONLINE_ORDER_CREATED;
  }

  async execute({
    payment,
    ride,
    amount,
  }: PaymentStrategyParams): Promise<Result<OnlinePaymentInitData>> {
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

    Logger.info("Online order created", { paymentId: payment.getId(), rideId });

    return Result.success({
      paymentId: payment.getId(),
      gatewayOrderId: order.gatewayOrderId,
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
      gateway: "razorpay",
    });
  }
}
