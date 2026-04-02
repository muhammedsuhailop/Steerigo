import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { Transaction } from "@domain/entities/Transaction";
import { GetAdminTransactionsDto } from "@application/dto/admin/GetAdminTransactionsDto";
import {
  GetAdminTransactionsResponseDto,
  TransactionItem,
} from "@application/dto/admin/GetAdminTransactionsResponseDto";
import { TRANSACTION__MESSAGES } from "@shared/constants/TransactionMessages";

@injectable()
export class GetAdminTransactionsUseCase
  implements
    IUseCase<
      GetAdminTransactionsDto,
      Promise<Result<GetAdminTransactionsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    dto: GetAdminTransactionsDto,
  ): Promise<Result<GetAdminTransactionsResponseDto>> {
    try {
      Logger.info("Admin get transactions requested", {
        filters: dto.filters,
      });

      const result = await this.transactionRepository.findAllPaginated(
        dto.filters,
      );

      const transactions: TransactionItem[] = result.transactions.map(
        (tx: Transaction): TransactionItem => ({
          transactionId: tx.getId(),
          walletId: tx.getWalletId(),
          type: tx.getType(),
          direction: tx.getDirection(),
          amount: tx.getAmount().getAmount(),
          currency: tx.getAmount().getCurrency(),
          signedAmount: tx.getSignedAmount(),
          relatedEntityId: tx.getRelatedEntityId(),
          relatedEntityType: tx.getRelatedEntityType(),
          groupId: tx.getGroupId(),
          note: tx.getNote(),
          metadata: tx.getMetadata(),
          createdAt: tx.getCreatedAt().toISOString(),
        }),
      );

      Logger.info("Admin transactions fetched successfully", {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });

      return Result.success({
        success: true,
        message: TRANSACTION__MESSAGES.FETCHED,
        data: {
          transactions,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching admin transactions", {
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
