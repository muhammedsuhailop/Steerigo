import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { ConfirmCashPaymentDto } from "@application/dto/payment/ConfirmCashPaymentDto";
import { ConfirmCashPaymentResponseDto } from "@application/dto/payment/ConfirmCashPaymentResponseDto";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Money } from "@domain/value-objects/Money";
import { Payment } from "@domain/entities/Payment";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";
import { IEventBus } from "@application/services/IEventBus";

@injectable()
export class ConfirmCashPaymentUseCase
  implements
    IUseCase<
      ConfirmCashPaymentDto,
      Promise<Result<ConfirmCashPaymentResponseDto>>
    >
{
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.EarningsDistributionService)
    private readonly earningsDistributionService: IEarningsDistributionService,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: ConfirmCashPaymentDto,
  ): Promise<Result<ConfirmCashPaymentResponseDto>> {
    const rideId = dto.getRideId();

    try {
      Logger.info("Confirming cash payment by driver", {
        rideId,
        userId: dto.getUserId(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();
      let driverUserId: string | null = null;

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(PaymentErrors.paymentNotFound(rideId));
      }

      if (ride.getDriverId() !== driverId) {
        return Result.failure(
          PaymentErrors.cashConfirmationUnauthorized(rideId),
        );
      }

      if (!ride.isCompleted()) {
        return Result.failure(PaymentErrors.rideNotCompleted(rideId));
      }

      driverUserId = driver?.getUserId() ?? null;

      const existingPayment =
        await this.paymentRepository.findSuccessfulByRideId(rideId);
      if (existingPayment) {
        return Result.failure(PaymentErrors.paymentAlreadyExists(rideId));
      }

      const payableAmount = ride.getPayableAmount();
      const totalFare = ride.getFare();
      const discountAmount = ride.getDiscountAmount();

      const providedAmount = dto.getAmount();

      if (Math.abs(payableAmount - providedAmount) > 1) {
        return Result.failure(
          PaymentErrors.invalidPaymentAmount(
            payableAmount.toString(),
            providedAmount.toString(),
          ),
        );
      }

      const amount = Money.create(payableAmount, ride.getCurrency());

      const paymentId = this.idGenerator.generate();
      const paidAt = new Date();

      if (!ride.getTimeline().getPaymentInitiatedAt()) {
        ride.getTimeline().setPaymentInitiatedAt(paidAt);
      }
      ride.getTimeline().setPaymentCompletedAt(paidAt);

      const payment = Payment.create(
        paymentId,
        rideId,
        ride.getRiderId(),
        ride.getDriverId(),
        amount,
        PaymentMethod.CASH,
        { confirmedBy: driverId },
      );

      payment.confirmCashCollected(paidAt);

      const savedPayment = await this.paymentRepository.save(payment);

      ride.updatePaymentStatus(PaymentStatus.SUCCESS);
      await this.rideRepository.save(ride);

      const fareBreakdown = ride.getFareBreakdown();

      await this.earningsDistributionService
        .distributeCashPayment({
          rideId: ride.getRideId(),
          driverId: ride.getDriverId(),
          totalFare: fareBreakdown.getTotalFare(),
          platformFee: fareBreakdown.getPlatformFee(),
          platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
          payableAmount: Money.create(payableAmount, ride.getCurrency()),
          discount: Money.create(discountAmount, ride.getCurrency()),
        })
        .catch((err: Error) => {
          Logger.error("Earnings distribution failed after cash payment", {
            rideId,
            error: err.message,
          });
        });

      Logger.info("Cash payment confirmed and payment created", {
        paymentId: savedPayment.getId(),
        rideId,
        driverId,
        paidAt: paidAt.toISOString(),
        payableAmount,
        totalFare,
        discountAmount,
      });

      await this.eventBus.publish({
        type: "PaymentCashConfirmed",
        occurredAt: paidAt,
        payload: {
          paymentId: savedPayment.getId(),
          rideId,
          driverId,
          riderId: ride.getRiderId(),
          driverUserId: driverUserId as string,
          amount: payableAmount,
          currency: ride.getCurrency(),
          paidAt: paidAt.toISOString(),
        },
      });

      return Result.success({
        success: true,
        message: PAYMENT_MESSAGES.CONFIRMED,
        data: {
          paymentId: savedPayment.getId(),
          rideId: savedPayment.getRideId(),
          status: savedPayment.getStatus(),
          paidAt: paidAt.toISOString(),
          amount: payableAmount,
          currency: ride.getCurrency(),
        },
      });
    } catch (error) {
      Logger.error("Error confirming cash payment", {
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
