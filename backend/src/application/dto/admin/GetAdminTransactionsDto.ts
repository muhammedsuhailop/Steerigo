import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { AdminTransactionQueryFilters } from "@domain/repositories/ITransactionRepository";
import { TransactionErrors } from "@domain/errors/TransactionErrors";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 60;

interface RawQuery {
  walletId?: string;
  ownerId?: string;
  ownerType?: string;
  type?: string;
  direction?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

export class GetAdminTransactionsDto {
  private constructor(public readonly filters: AdminTransactionQueryFilters) {}

  static fromRequest(query: unknown): GetAdminTransactionsDto {
    const q = (query ?? {}) as RawQuery;

    if (
      q.type &&
      !Object.values(TransactionType).includes(q.type as TransactionType)
    ) {
      throw TransactionErrors.invalidTransactionType(q.type);
    }

    if (
      q.direction &&
      !Object.values(TransactionDirection).includes(
        q.direction as TransactionDirection,
      )
    ) {
      throw TransactionErrors.invalidTransactionDirection(q.direction);
    }

    if (
      q.ownerType &&
      !Object.values(WalletOwnerType).includes(q.ownerType as WalletOwnerType)
    ) {
      throw TransactionErrors.invalidOwnerType(q.ownerType);
    }

    const parseOptionalDate = (
      val: string | undefined,
      fieldName: string,
    ): Date | undefined => {
      if (!val) return undefined;
      const d = new Date(val);
      if (isNaN(d.getTime())) {
        throw TransactionErrors.invalidDateField(fieldName);
      }
      return d;
    };

    const fromDate = parseOptionalDate(q.fromDate, "fromDate");
    const toDate = parseOptionalDate(q.toDate, "toDate");

    if (fromDate && toDate && fromDate > toDate) {
      throw TransactionErrors.invalidDateRange();
    }

    const rawSearch = q.search?.trim();
    const search =
      rawSearch && rawSearch.length > 0
        ? rawSearch.slice(0, MAX_SEARCH_LENGTH)
        : undefined;

    const sortBy: "createdAt" | "amount" =
      q.sortBy === "amount" ? "amount" : "createdAt";

    const sortOrder: "asc" | "desc" = q.sortOrder === "asc" ? "asc" : "desc";

    const rawPage = q.page ? parseInt(q.page, 10) : DEFAULT_PAGE;
    const rawLimit = q.limit ? parseInt(q.limit, 10) : DEFAULT_LIMIT;

    if (isNaN(rawPage) || rawPage < 1) {
      throw TransactionErrors.invalidPaginationField("page");
    }
    if (isNaN(rawLimit) || rawLimit < 1) {
      throw TransactionErrors.invalidPaginationField("limit");
    }

    const page = Math.max(1, rawPage);
    const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));

    const filters: AdminTransactionQueryFilters = {
      walletId: q.walletId?.trim() || undefined,
      ownerId: q.ownerId?.trim() || undefined,
      ownerType: q.ownerType ? (q.ownerType as WalletOwnerType) : undefined,
      type: q.type ? (q.type as TransactionType) : undefined,
      direction: q.direction
        ? (q.direction as TransactionDirection)
        : undefined,
      relatedEntityId: q.relatedEntityId?.trim() || undefined,
      relatedEntityType: q.relatedEntityType?.trim() || undefined,
      fromDate,
      toDate,
      sortBy,
      search,
      sortOrder,
      page,
      limit,
    };

    return new GetAdminTransactionsDto(filters);
  }
}
