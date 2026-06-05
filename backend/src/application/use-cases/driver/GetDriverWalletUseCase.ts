import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverWalletDto } from "@application/dto/driver/GetDriverWalletDto";
import {
  GetDriverWalletResponseDto,
  TransactionItemData,
} from "@application/dto/driver/GetDriverWalletResponseDto";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Transaction } from "@domain/entities/Transaction";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Wallet } from "@domain/entities/Wallet";
import { IIdGenerator } from "@application/services/IIdGenerator";

@injectable()
export class GetDriverWalletUseCase
  implements
    IUseCase<GetDriverWalletDto, Promise<Result<GetDriverWalletResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: GetDriverWalletDto,
  ): Promise<Result<GetDriverWalletResponseDto>> {
    try {
      Logger.info("Fetching driver wallet", {
        userId: dto.getUserId(),
        page: dto.getPage(),
        limit: dto.getLimit(),
        type: dto.getType(),
        direction: dto.getDirection(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();

      let wallet = await this.walletRepository.findByOwner(
        driverId,
        WalletOwnerType.DRIVER,
      );

      if (!wallet) {
        if (!wallet) {
          Logger.info(
            "Driver wallet not found, creating new one during fetch",
            { driverId },
          );

          wallet = Wallet.create({
            id: this.idGenerator.generate(),
            ownerId: driverId,
            ownerType: WalletOwnerType.DRIVER,
          });

          await this.walletRepository.save(wallet);
        }
      }

      const paginatedResult =
        await this.transactionRepository.findPaginatedByWalletId(
          wallet.getId(),
          {
            type: dto.getType(),
            direction: dto.getDirection(),
            fromDate: dto.getFromDate(),
            toDate: dto.getToDate(),
            page: dto.getPage(),
            limit: dto.getLimit(),
            sortOrder: dto.getSortOrder(),
          },
        );

      Logger.info("Driver wallet fetched successfully", {
        driverId,
        walletId: wallet.getId(),
        availableBalance: wallet.getAvailableBalance().getAmount(),
        transactionTotal: paginatedResult.total,
      });

      return Result.success({
        walletId: wallet.getId(),
        driverId,
        availableBalance: wallet.getAvailableBalance().getAmount(),
        pendingBalance: wallet.getPendingBalance().getAmount(),
        currency: wallet.getCurrency(),
        updatedAt: wallet.getUpdatedAt().toISOString(),
        transactions: paginatedResult.transactions.map(
          this.toTransactionItemData,
        ),
        pagination: {
          total: paginatedResult.total,
          page: paginatedResult.page,
          limit: paginatedResult.limit,
          totalPages: paginatedResult.totalPages,
        },
      });
    } catch (error) {
      Logger.error("Error fetching driver wallet", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }

  private toTransactionItemData(transaction: Transaction): TransactionItemData {
    return {
      id: transaction.getId(),
      type: transaction.getType(),
      direction: transaction.getDirection(),
      amount: transaction.getAmount().getAmount(),
      currency: transaction.getAmount().getCurrency(),
      relatedEntityId: transaction.getRelatedEntityId(),
      relatedEntityType: transaction.getRelatedEntityType(),
      note: transaction.getNote(),
      createdAt: transaction.getCreatedAt().toISOString(),
    };
  }
}
