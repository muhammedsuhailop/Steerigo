import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { MarkPaymentFailedDto } from "@application/dto/payment/MarkPaymentFailedDto";
import { MarkPaymentFailedResponseDto } from "@application/dto/payment/MarkPaymentFailedResponseDto";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { PAYMENT_MESSAGES } from "@shared/constants/PaymentMessages";

@injectable()
export class MarkPaymentFailedUseCase
  implements
    IUseCase<
      MarkPaymentFailedDto,
      Promise<Result<MarkPaymentFailedResponseDto>>
    >
{
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
  ) {}

  async execute(
    dto: MarkPaymentFailedDto,
  ): Promise<Result<MarkPaymentFailedResponseDto>> {
    const paymentId = dto.getPaymentId();

    try {
      Logger.info("Marking payment as failed", {
        paymentId,
        userId: dto.getUserId(),
        reason: dto.getReason(),
      });

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return Result.failure(PaymentErrors.paymentNotFound(paymentId));
      }

      if (payment.getRiderId() !== dto.getUserId()) {
        return Result.failure(
          PaymentErrors.unauthorizedPaymentAccess(paymentId),
        );
      }

      if (payment.getStatus() !== PaymentStatus.PENDING) {
        return Result.failure(PaymentErrors.paymentNotPending(paymentId));
      }

      const failedAt = new Date();
      payment.markFailed(dto.getReason());
      const savedPayment = await this.paymentRepository.save(payment);

      const ride = await this.rideRepository.findByRideId(payment.getRideId());
      if (ride) {
        ride.getTimeline().setPaymentFailedAt(failedAt);
        ride.updatePaymentStatus(PaymentStatus.FAILED);
        await this.rideRepository.save(ride);
      }

      Logger.info("Payment marked as failed", {
        paymentId,
        rideId: payment.getRideId(),
        reason: dto.getReason(),
        failedAt: failedAt.toISOString(),
      });

      return Result.success({
        success: true,
        message: PAYMENT_MESSAGES.PAYMENT_FAILED,
        data: {
          paymentId: savedPayment.getId(),
          rideId: savedPayment.getRideId(),
          status: savedPayment.getStatus(),
          method: savedPayment.getMethod(),
          failureReason: dto.getReason(),
          amount: savedPayment.getAmount().getAmount(),
          currency: savedPayment.getAmount().getCurrency(),
          failedAt: failedAt.toISOString(),
        },
      });
    } catch (error) {
      Logger.error("Error marking payment as failed", {
        paymentId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }
}
