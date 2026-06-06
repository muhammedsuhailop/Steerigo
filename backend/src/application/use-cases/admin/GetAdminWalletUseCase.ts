import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { Wallet } from "@domain/entities/Wallet";
import { Transaction } from "@domain/entities/Transaction";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { GetAdminWalletDto } from "@application/dto/admin/GetAdminWalletDto";
import {
  GetAdminWalletResponseDto,
  AdminTransactionItemData,
} from "@application/dto/admin/GetAdminWalletResponseDto";
@injectable()
export class GetAdminWalletUseCase
  implements
    IUseCase<GetAdminWalletDto, Promise<Result<GetAdminWalletResponseDto>>>
{
  constructor(
    @inject(TYPES.WalletRepository)
    private readonly walletRepository: IWalletRepository,

    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,

    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: GetAdminWalletDto,
  ): Promise<Result<GetAdminWalletResponseDto>> {
    const ADMIN_WALLET_OWNER_ID: string = process.env
      .ADMIN_WALLET_OWNER_ID as string;
    try {
      Logger.info("Fetching admin wallet", {
        page: dto.getPage(),
        limit: dto.getLimit(),
        type: dto.getType(),
        direction: dto.getDirection(),
      });

      let wallet = await this.walletRepository.findByOwner(
        ADMIN_WALLET_OWNER_ID,
        WalletOwnerType.PLATFORM,
      );

      if (!wallet) {
        Logger.info(
          "Admin platform wallet not found, creating new one during fetch",
          { ownerId: ADMIN_WALLET_OWNER_ID },
        );

        wallet = Wallet.create({
          id: this.idGenerator.generate(),
          ownerId: ADMIN_WALLET_OWNER_ID,
          ownerType: WalletOwnerType.PLATFORM,
        });

        await this.walletRepository.save(wallet);
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

      Logger.info("Admin wallet fetched successfully", {
        walletId: wallet.getId(),
        availableBalance: wallet.getAvailableBalance().getAmount(),
        pendingBalance: wallet.getPendingBalance().getAmount(),
        transactionTotal: paginatedResult.total,
      });

      return Result.success({
        walletId: wallet.getId(),
        ownerId: wallet.getOwnerId(),
        availableBalance: wallet.getAvailableBalance().getAmount(),
        pendingBalance: wallet.getPendingBalance().getAmount(),
        totalBalance: wallet.getTotalBalance().getAmount(),
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
      Logger.error("Error fetching admin wallet", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return Result.failure(error as Error);
    }
  }

  private toTransactionItemData(
    transaction: Transaction,
  ): AdminTransactionItemData {
    return {
      id: transaction.getId(),
      type: transaction.getType(),
      direction: transaction.getDirection(),
      amount: transaction.getAmount().getAmount(),
      currency: transaction.getAmount().getCurrency(),
      signedAmount: transaction.getSignedAmount(),
      relatedEntityId: transaction.getRelatedEntityId(),
      relatedEntityType: transaction.getRelatedEntityType(),
      groupId: transaction.getGroupId(),
      note: transaction.getNote(),
      createdAt: transaction.getCreatedAt().toISOString(),
    };
  }
}
