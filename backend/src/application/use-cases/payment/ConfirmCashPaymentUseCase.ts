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
  ) {}

  async execute(
    dto: ConfirmCashPaymentDto,
  ): Promise<Result<ConfirmCashPaymentResponseDto>> {
    const paymentId = dto.getPaymentId();

    try {
      Logger.info("Confirming cash payment", {
        paymentId,
        userId: dto.getUserId(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return Result.failure(PaymentErrors.paymentNotFound(paymentId));
      }

      if (payment.getDriverId() !== driverId) {
        return Result.failure(
          PaymentErrors.cashConfirmationUnauthorized(payment.getRideId()),
        );
      }

      if (!payment.isCash()) {
        return Result.failure(
          PaymentErrors.invalidPaymentMethod(payment.getMethod()),
        );
      }

      if (payment.getStatus() !== PaymentStatus.PENDING) {
        return Result.failure(PaymentErrors.paymentNotPending(paymentId));
      }

      const paidAt = new Date();
      payment.confirmCashCollected(paidAt);
      const savedPayment = await this.paymentRepository.save(payment);

      const ride = await this.rideRepository.findByRideId(payment.getRideId());
      if (ride) {
        ride.updatePaymentStatus(PaymentStatus.SUCCESS);
        await this.rideRepository.save(ride);

        const fareBreakdown = ride.getFareBreakdown();
        await this.earningsDistributionService
          .distribute({
            rideId: ride.getRideId(),
            driverId: ride.getDriverId(),
            totalFare: fareBreakdown.getTotalFare(),
            platformFee: fareBreakdown.getPlatformFee(),
            platformFeeTax: fareBreakdown.getPlatformFeeTax().amount,
          })
          .catch((err: Error) => {
            Logger.error("Earnings distribution failed after cash payment", {
              paymentId,
              rideId: ride.getRideId(),
              error: err.message,
            });
          });
      }

      Logger.info("Cash payment confirmed", {
        paymentId,
        rideId: payment.getRideId(),
        driverId,
        paidAt: paidAt.toISOString(),
      });

      return Result.success({
        success: true,
        message: "Cash payment confirmed successfully.",
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
      Logger.error("Error confirming cash payment", {
        paymentId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
