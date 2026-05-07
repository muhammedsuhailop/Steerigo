import { injectable, inject, multiInject } from "inversify";
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
import { Payment } from "@domain/entities/Payment";
import { Money } from "@domain/value-objects/Money";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { RideErrors } from "@domain/errors/RideErrors";
import { IEventBus } from "@application/services/IEventBus";
import { IPaymentStrategy } from "@application/services/payment/IPaymentStrategy";
import { IIdGenerator } from "@application/services/IIdGenerator";

@injectable()
export class InitiatePaymentUseCase
  implements
    IUseCase<InitiatePaymentDto, Promise<Result<InitiatePaymentResponseDto>>>
{
  private readonly strategyMap: Map<
    PaymentMethod,
    IPaymentStrategy<
      OnlinePaymentInitData | WalletPaymentInitData | CashPaymentInitData
    >
  >;

  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,

    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,

    @inject(TYPES.NanoIdGenerator)
    private idGenerator: IIdGenerator,

    @multiInject(TYPES.PaymentStrategies)
    strategies: IPaymentStrategy<
      OnlinePaymentInitData | WalletPaymentInitData | CashPaymentInitData
    >[],
  ) {
    this.strategyMap = new Map(
      strategies.map((strategy) => [strategy.getMethod(), strategy]),
    );
  }

  async execute(
    dto: InitiatePaymentDto,
  ): Promise<Result<InitiatePaymentResponseDto>> {
    const rideId = dto.getRideId();
    const method = dto.getMethod();
    const userId = dto.getUserId();

    try {
      Logger.info("Initiating payment", { userId, rideId, method });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) return Result.failure(RideErrors.rideNotFound(rideId));

      if (!ride.isCompleted()) {
        return Result.failure(PaymentErrors.rideNotCompleted(rideId));
      }

      if (ride.getRiderId() !== userId) {
        return Result.failure(PaymentErrors.unauthorizedPaymentAccess(rideId));
      }

      const existingPayment =
        await this.paymentRepository.findSuccessfulByRideId(rideId);
      if (existingPayment) {
        return Result.failure(PaymentErrors.paymentAlreadyExists(rideId));
      }

      const now = new Date();
      ride.getTimeline().setPaymentInitiatedAt(now);

      const amount = Money.create(ride.getPayableAmount(), ride.getCurrency());

      const paymentId = this.idGenerator.generate("PAY");

      const payment = Payment.create(
        paymentId,
        rideId,
        ride.getRiderId(),
        ride.getDriverId(),
        amount,
        method,
        { initiatedBy: userId },
      );

      await this.eventBus.publish({
        type: "PaymentInitiated",
        occurredAt: new Date(),
        payload: {
          paymentId: payment.getId(),
          rideId,
          riderId: ride.getRiderId(),
          amount: amount.getAmount(),
          currency: amount.getCurrency(),
          method: payment.getMethod(),
        },
      });

      const strategy = this.strategyMap.get(method);

      if (!strategy) {
        return Result.failure(PaymentErrors.invalidPaymentMethod(method));
      }

      const result = await strategy.execute({
        payment,
        ride,
        amount,
        userId,
      });

      if (result.isFailure()) {
        return Result.failure(result.getError()!);
      }

      return Result.success({
        success: true,
        method,
        message: strategy.getSuccessMessage(),
        data: result.getValue(),
      });
    } catch (error) {
      Logger.error("Error initiating payment", {
        userId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
