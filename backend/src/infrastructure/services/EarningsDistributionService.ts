import { injectable, inject } from "inversify";
import {
  IEarningsDistributionService,
  DistributeEarningsParams,
  EarningsDistributionResult,
  DistributeCancellationParams,
} from "@application/services/IEarningsDistributionService";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { Wallet } from "@domain/entities/Wallet";
import { Transaction } from "@domain/entities/Transaction";
import { Money } from "@domain/value-objects/Money";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { Types } from "mongoose";

const PLATFORM_OWNER_ID = "platform";

@injectable()
export class EarningsDistributionService
  implements IEarningsDistributionService
{
  constructor(
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async distribute(
    params: DistributeEarningsParams,
  ): Promise<EarningsDistributionResult> {
    const { rideId, driverId, totalFare, platformFee, platformFeeTax } = params;

    const platformRevenueMoney = platformFee.add(platformFeeTax);
    const driverEarningsMoney = totalFare.subtract(platformRevenueMoney);

    Logger.info("Distributing ride earnings", {
      rideId,
      driverId,
      totalFare: totalFare.getAmount(),
      platformRevenue: platformRevenueMoney.getAmount(),
      driverEarnings: driverEarningsMoney.getAmount(),
    });

    await this.creditDriverWallet(driverId, driverEarningsMoney, rideId);
    await this.creditPlatformWallet(platformRevenueMoney, rideId);

    return {
      driverEarnings: driverEarningsMoney.getAmount(),
      platformRevenue: platformRevenueMoney.getAmount(),
      currency: totalFare.getCurrency(),
    };
  }

  async distributeCancellation(
    params: DistributeCancellationParams,
  ): Promise<void> {
    const { rideId, driverId, riderId, riderCharge, driverPenalty } = params;

    if (driverPenalty.getAmount() > 0) {
      await this.debitWallet(
        driverId,
        WalletOwnerType.DRIVER,
        driverPenalty,
        rideId,
        TransactionType.DRIVER_PENALTY,
        `Penalty for driver cancellation: ${rideId}`,
      );
      await this.creditPlatformWallet(
        driverPenalty,
        rideId,
        TransactionType.DRIVER_PENALTY_REVENUE,
        `Revenue from driver penalty: ${rideId}`,
      );
    }

    if (riderCharge.getAmount() > 0) {
      await this.debitWallet(
        riderId,
        WalletOwnerType.RIDER,
        riderCharge,
        rideId,
        TransactionType.RIDER_CANCELLATION_FEE,
        `Cancellation fee for ride: ${rideId}`,
      );
      await this.creditPlatformWallet(riderCharge, rideId);
    }
  }

  private async debitWallet(
    ownerId: string,
    ownerType: WalletOwnerType,
    amount: Money,
    rideId: string,
    type: TransactionType,
    note: string,
  ): Promise<void> {
    const wallet = await this.walletRepository.findByOwner(ownerId, ownerType);
    if (!wallet) {
      throw new Error(
        `${ownerType} wallet not found for debiting ${amount.getAmount()}`,
      );
    }

    wallet.forceDebit(amount);
    await this.walletRepository.save(wallet);

    const transaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: type,
      direction: TransactionDirection.DEBIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: note,
    });

    await this.transactionRepository.save(transaction);
  }

  private async creditDriverWallet(
    driverId: string,
    amount: Money,
    rideId: string,
  ): Promise<void> {
    let wallet = await this.walletRepository.findByOwner(
      driverId,
      WalletOwnerType.DRIVER,
    );

    if (!wallet) {
      Logger.info("Driver wallet not found, creating new one", { driverId });
      wallet = Wallet.create({
        id: new Types.ObjectId().toString(),
        ownerId: driverId,
        ownerType: WalletOwnerType.DRIVER,
      });
    }

    wallet.credit(amount);
    await this.walletRepository.save(wallet);

    const transaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: TransactionType.DRIVER_EARNING,
      direction: TransactionDirection.CREDIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: `Driver earnings for ride ${rideId}`,
    });

    await this.transactionRepository.save(transaction);

    Logger.info("Driver wallet credited", {
      driverId,
      amount: amount.getAmount(),
      rideId,
    });
  }

  private async creditPlatformWallet(
    amount: Money,
    rideId: string,
    type: TransactionType = TransactionType.PLATFORM_COMMISSION,
    note?: string,
  ): Promise<void> {
    let wallet = await this.walletRepository.findByOwner(
      PLATFORM_OWNER_ID,
      WalletOwnerType.PLATFORM,
    );

    if (!wallet) {
      Logger.info("Platform wallet not found, creating new one");
      wallet = Wallet.create({
        id: new Types.ObjectId().toString(),
        ownerId: PLATFORM_OWNER_ID,
        ownerType: WalletOwnerType.PLATFORM,
      });
    }

    wallet.credit(amount);
    await this.walletRepository.save(wallet);

    const transaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: type,
      direction: TransactionDirection.CREDIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: note ?? `Platform commission for ride ${rideId}`,
    });

    await this.transactionRepository.save(transaction);

    Logger.info("Platform wallet credited", {
      amount: amount.getAmount(),
      rideId,
    });
  }
}
