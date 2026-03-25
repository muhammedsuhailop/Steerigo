import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { VerifyPaymentDto } from "@application/dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "@application/dto/payment/VerifyPaymentResponseDto";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IPaymentGatewayService } from "@application/services/IPaymentGatewayService";
import { IEarningsDistributionService } from "@application/services/IEarningsDistributionService";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";
import { PaymentFailureReason } from "@domain/value-objects/PaymentFailureReason";
import { IEventBus } from "@application/services/IEventBus";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";

@injectable()
export class VerifyPaymentUseCase
  implements
    IUseCase<VerifyPaymentDto, Promise<Result<VerifyPaymentResponseDto>>>
{
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.PaymentGatewayService)
    private readonly paymentGatewayService: IPaymentGatewayService,
    @inject(TYPES.EarningsDistributionService)
    private readonly earningsDistributionService: IEarningsDistributionService,
    @inject(TYPES.EventBus)
    private readonly eventBus: IEventBus,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: VerifyPaymentDto,
  ): Promise<Result<VerifyPaymentResponseDto>> {
    const paymentId = dto.getPaymentId();

    try {
      Logger.info("Verifying payment", { paymentId, userId: dto.getUserId() });

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return Result.failure(PaymentErrors.paymentNotFound(paymentId));
      }

      if (payment.getRiderId() !== dto.getUserId()) {
        return Result.failure(
          PaymentErrors.unauthorizedPaymentAccess(paymentId),
        );
      }

      const ride = await this.rideRepository.findByRideId(payment.getRideId());
      const now = new Date();

      const isValid = this.paymentGatewayService.verifySignature({
        gatewayOrderId: dto.getGatewayOrderId(),
        gatewayPaymentId: dto.getGatewayPaymentId(),
        gatewaySignature: dto.getGatewaySignature(),
      });

      let driverUserId: string | null = null;

      if (ride) {
        const driver = await this.driverRepository.findById(ride.getDriverId());

        driverUserId = driver?.getUserId() ?? null;
      }

      if (!isValid) {
        payment.markFailed(PaymentFailureReason.SIGNATURE_VERIFICATION_FAILED);
        await this.paymentRepository.save(payment);

        await this.eventBus.publish({
          type: "PaymentFailed",
          occurredAt: now,
          payload: {
            paymentId,
            rideId: payment.getRideId(),
            driverUserId: driverUserId as string,
            riderId: payment.getRiderId(),
            reason: PaymentFailureReason.SIGNATURE_VERIFICATION_FAILED,
            failedAt: now.toISOString(),
          },
        });

        if (ride) {
          ride.getTimeline().setPaymentFailedAt(now);
          await this.rideRepository.save(ride);
        }

        Logger.warn("Payment signature invalid", { paymentId });
        return Result.failure(PaymentErrors.invalidSignature());
      }

      payment.attachGatewayIds({
        gatewayPaymentId: dto.getGatewayPaymentId(),
        gatewaySignature: dto.getGatewaySignature(),
      });
      payment.markSuccess(dto.getGatewayPaymentId(), now);

      const savedPayment = await this.paymentRepository.save(payment);

      if (ride) {
        ride.getTimeline().setPaymentCompletedAt(now);
        ride.updatePaymentStatus(PaymentStatus.SUCCESS);
        await this.rideRepository.save(ride);

        const driver = await this.driverRepository.findById(ride.getDriverId());

        driverUserId = driver?.getUserId() ?? null;

        const fareBreakdown = ride.getFareBreakdown();
        await this.earningsDistributionService
          .distribute({
            rideId: ride.getRideId(),
            driverId: ride.getDriverId(),
            totalFare: ride.getFareBreakdown().getTotalFare(),
            platformFee: fareBreakdown.getPlatformFee(),
            platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
          })
          .catch((err: Error) => {
            Logger.error("Earnings distribution failed after online payment", {
              paymentId,
              rideId: ride.getRideId(),
              error: err.message,
            });
          });
      }

      Logger.info("Payment verified and marked successful", {
        paymentId,
        rideId: payment.getRideId(),
        paidAt: now.toISOString(),
      });

      await this.eventBus.publish({
        type: "PaymentSucceeded",
        occurredAt: now,
        payload: {
          paymentId,
          rideId: payment.getRideId(),
          driverId: ride?.getDriverId() as string,
          driverUserId: driverUserId as string,
          riderId: payment.getRiderId(),
          amount: payment.getAmount().getAmount(),
          currency: payment.getAmount().getCurrency(),
          paidAt: now.toISOString(),
        },
      });

      return Result.success({
        success: true,
        message: PAYMENT_MESSAGES.VERIFIED,
        data: {
          paymentId: savedPayment.getId(),
          rideId: savedPayment.getRideId(),
          status: savedPayment.getStatus(),
          paidAt: now.toISOString(),
          amount: savedPayment.getAmount().getAmount(),
          currency: savedPayment.getAmount().getCurrency(),
        },
      });
    } catch (error) {
      Logger.error("Error verifying payment", {
        paymentId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
