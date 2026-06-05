import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { RequestPayoutDto } from "@application/dto/driver/RequestPayoutDto";
import { RequestPayoutResponseDto } from "@application/dto/driver/RequestPayoutResponseDto";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Payout } from "@domain/entities/Payout";
import { Money } from "@domain/value-objects/Money";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { PayoutErrors } from "@domain/errors/PayoutErrors";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Types } from "mongoose";

const MINIMUM_PAYOUT_AMOUNT = 100;
const PAYOUT_CURRENCY = "INR";

@injectable()
export class RequestPayoutUseCase
  implements
    IUseCase<RequestPayoutDto, Promise<Result<RequestPayoutResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.PayoutRepository)
    private readonly payoutRepository: IPayoutRepository,
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(
    dto: RequestPayoutDto,
  ): Promise<Result<RequestPayoutResponseDto>> {
    try {
      Logger.info("Processing payout request", {
        userId: dto.getUserId(),
        amount: dto.getAmount(),
        method: dto.getMethod(),
      });

      if (dto.getAmount() < MINIMUM_PAYOUT_AMOUNT) {
        return Result.failure(
          PayoutErrors.belowMinimumAmount(
            MINIMUM_PAYOUT_AMOUNT.toString(),
            PAYOUT_CURRENCY,
          ),
        );
      }

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      const pendingPayout =
        await this.payoutRepository.findPendingByDriverId(driverId);
      if (pendingPayout) {
        return Result.failure(PayoutErrors.pendingPayoutExists(driverId));
      }

      const wallet = await this.walletRepository.findByOwner(
        driverId,
        WalletOwnerType.DRIVER,
      );
      if (!wallet) {
        return Result.failure(PayoutErrors.driverWalletNotFound(driverId));
      }

      const requestedAmount = Money.create(dto.getAmount(), PAYOUT_CURRENCY);

      if (
        wallet.getAvailableBalance().getAmount() < requestedAmount.getAmount()
      ) {
        return Result.failure(
          PayoutErrors.insufficientDriverBalance(
            wallet.getAvailableBalance().getAmount().toString(),
            requestedAmount.getAmount().toString(),
          ),
        );
      }

      const payout = Payout.request({
        id: new Types.ObjectId().toString(),
        driverId,
        amount: requestedAmount,
        method: dto.getMethod(),
        destination: dto.getDestination(),
      });

      const savedPayout = await this.payoutRepository.save(payout);

      Logger.info("Payout request created", {
        payoutId: savedPayout.getId(),
        driverId,
        amount: dto.getAmount(),
      });

      return Result.success({
        payoutId: savedPayout.getId(),
        driverId,
        amount: savedPayout.getAmount().getAmount(),
        currency: savedPayout.getCurrency(),
        method: savedPayout.getMethod(),
        status: savedPayout.getStatus(),
        createdAt: savedPayout.getCreatedAt().toISOString(),
      });
    } catch (error) {
      Logger.error("Error requesting payout", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
