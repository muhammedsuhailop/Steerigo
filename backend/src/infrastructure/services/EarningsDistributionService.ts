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
    const {
      rideId,
      driverId,
      totalFare,
      platformFee,
      platformFeeTax,
      payableAmount,
      discount,
      groupId,
    } = params;

    const platformRevenue = platformFee.add(platformFeeTax);
    const discountMoney = discount ?? Money.zero(totalFare.getCurrency());

    const driverEarnings = totalFare.subtract(platformRevenue);
    const payable = payableAmount ?? totalFare;

    if (await this.transactionRepository.existsByGroupId(groupId as string)) {
      Logger.warn("Settlement already processed, skipping", { groupId });
      return {
        driverEarnings: 0,
        platformRevenue: 0,
        currency: totalFare.getCurrency(),
      };
    }

    await this.recordAuditOnlyTransaction(
      PLATFORM_OWNER_ID,
      WalletOwnerType.PLATFORM,
      payable,
      rideId,
      TransactionType.RIDER_PAYMENT_ONLINE,
      `Online payment received from rider for ride: ${rideId}`,
      groupId,
    );

    Logger.info("Distributing ONLINE earnings", {
      rideId,
      driverId,
      totalFare: totalFare.getAmount(),
      payableAmount: payableAmount?.getAmount(),
      discount: discountMoney.getAmount(),
      platformRevenue: platformRevenue.getAmount(),
      driverEarnings: driverEarnings.getAmount(),
    });

    if (discountMoney.getAmount() > 0) {
      await this.debitWallet(
        PLATFORM_OWNER_ID,
        WalletOwnerType.PLATFORM,
        discountMoney,
        rideId,
        TransactionType.COUPON_EXPENSE,
        `Coupon expense for ride: ${rideId}`,
        groupId,
      );
    }
    await this.debitWallet(
      PLATFORM_OWNER_ID,
      WalletOwnerType.PLATFORM,
      driverEarnings,
      rideId,
      TransactionType.DRIVER_SETTLEMENT,
      `Driver payout for ride: ${rideId}`,
      groupId,
    );

    await this.creditDriverWallet(
      driverId,
      driverEarnings,
      rideId,
      TransactionType.DRIVER_EARNING,
      `Online ride earning for ride: ${rideId}`,
      groupId,
    );

    await this.creditPlatformWallet(
      platformRevenue,
      rideId,
      TransactionType.PLATFORM_COMMISSION,
      `Platform commission for online ride: ${rideId}`,
      groupId,
    );

    return {
      driverEarnings: driverEarnings.getAmount(),
      platformRevenue: platformRevenue.getAmount() - discountMoney.getAmount(),
      currency: totalFare.getCurrency(),
    };
  }

  async distributeCashPayment(params: DistributeEarningsParams): Promise<void> {
    const {
      rideId,
      driverId,
      totalFare,
      payableAmount,
      discount,
      platformFee,
      platformFeeTax,
    } = params;

    const platformRevenue = platformFee.add(platformFeeTax);

    const discountMoney = discount ?? Money.create(0, totalFare.getCurrency());
    const payable = payableAmount ?? totalFare;

    Logger.info("Processing cash earnings distribution", {
      rideId,
      driverId,
      totalFare: totalFare.getAmount(),
      payableAmount: payableAmount?.getAmount(),
      discount: discount?.getAmount(),
      platformRevenue: platformRevenue.getAmount(),
    });

    if (discountMoney.getAmount() > 0) {
      await this.debitWallet(
        "platform",
        WalletOwnerType.PLATFORM,
        discountMoney,
        rideId,
        TransactionType.COUPON_EXPENSE,
        `Coupon discount compensated to driver for ride: ${rideId}`,
      );

      await this.creditDriverWallet(
        driverId,
        discountMoney,
        rideId,
        TransactionType.DRIVER_COUPON_CREDIT,
        `Coupon compensation for ride: ${rideId}`,
      );
    }

    await this.debitWallet(
      driverId,
      WalletOwnerType.DRIVER,
      platformRevenue,
      rideId,
      TransactionType.PLATFORM_COMMISSION_CASH_RIDE,
      `Platform fee deduction for cash ride: ${rideId}`,
    );

    await this.creditPlatformWallet(
      platformRevenue,
      rideId,
      TransactionType.PLATFORM_COMMISSION,
      `Platform commission for cash ride: ${rideId}`,
    );

    await this.recordAuditOnlyTransaction(
      driverId,
      WalletOwnerType.DRIVER,
      payable,
      rideId,
      TransactionType.RIDE_PAYMENT_CASH,
      `Cash collected from rider (after discount) for ride: ${rideId}`,
    );

    const driverNet = totalFare.getAmount() - platformRevenue.getAmount();

    const platformNet = platformRevenue.getAmount() - discountMoney.getAmount();

    Logger.info("Cash distribution completed", {
      rideId,
      driverId,
      driverExpectedEarnings: driverNet,
      platformNetRevenue: platformNet,
      note: "Driver earnings unaffected by coupon; platform bears discount",
    });
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
    groupId?: string,
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
      groupId,
    });

    await this.transactionRepository.save(transaction);
  }

  private async creditDriverWallet(
    driverId: string,
    amount: Money,
    rideId: string,
    type: TransactionType = TransactionType.DRIVER_EARNING,
    note?: string,
    groupId?: string,
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
      type: type,
      direction: TransactionDirection.CREDIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: note ?? `Driver earnings for ride ${rideId}`,
      groupId,
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
    groupId?: string,
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
      groupId,
    });

    await this.transactionRepository.save(transaction);

    Logger.info("Platform wallet credited", {
      amount: amount.getAmount(),
      rideId,
    });
  }

  private async recordAuditOnlyTransaction(
    ownerId: string,
    ownerType: WalletOwnerType,
    amount: Money,
    rideId: string,
    type: TransactionType,
    note: string,
    groupId?: string,
  ): Promise<void> {
    const wallet = await this.walletRepository.findByOwner(ownerId, ownerType);
    if (!wallet) return;

    const transaction = Transaction.create({
      id: new Types.ObjectId().toString(),
      walletId: wallet.getId(),
      type: type,
      direction: TransactionDirection.CREDIT,
      amount,
      relatedEntityId: rideId,
      relatedEntityType: "Ride",
      note: note,
      groupId,
    });

    await this.transactionRepository.save(transaction);
  }
}
