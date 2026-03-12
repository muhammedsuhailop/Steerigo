import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { VerifyPaymentDto } from "@application/dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "@application/dto/payment/VerifyPaymentResponseDto";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IPaymentGatewayService } from "@application/services/IPaymentGatewayService";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentErrors } from "@domain/errors/PaymentErrors";
import { RideErrors } from "@domain/errors/RideErrors";

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

      if (payment.getStatus() !== PaymentStatus.PENDING) {
        return Result.failure(PaymentErrors.paymentNotPending(paymentId));
      }

      const isValid = this.paymentGatewayService.verifySignature({
        gatewayOrderId: dto.getGatewayOrderId(),
        gatewayPaymentId: dto.getGatewayPaymentId(),
        gatewaySignature: dto.getGatewaySignature(),
      });

      if (!isValid) {
        payment.markFailed("Signature verification failed");
        await this.paymentRepository.save(payment);
        Logger.warn("Payment signature invalid", { paymentId });
        return Result.failure(PaymentErrors.invalidSignature());
      }

      const paidAt = new Date();
      payment.attachGatewayIds({
        gatewayPaymentId: dto.getGatewayPaymentId(),
        gatewaySignature: dto.getGatewaySignature(),
      });
      payment.markSuccess(dto.getGatewayPaymentId(), paidAt);

      const savedPayment = await this.paymentRepository.save(payment);

      const ride = await this.rideRepository.findByRideId(payment.getRideId());
      if (ride) {
        ride.updatePaymentStatus(PaymentStatus.SUCCESS);
        await this.rideRepository.save(ride);
      }

      Logger.info("Payment verified and marked successful", {
        paymentId,
        rideId: payment.getRideId(),
        paidAt: paidAt.toISOString(),
      });

      return Result.success({
        success: true,
        message: "Payment verified successfully.",
        data: {
          paymentId: savedPayment.getId(),
          rideId: savedPayment.getRideId(),
          status: savedPayment.getStatus(),
          paidAt: paidAt.toISOString(),
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
