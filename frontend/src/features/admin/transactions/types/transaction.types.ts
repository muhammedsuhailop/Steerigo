import { AdminTableRow } from "@/shared/components/ui/AdminTable/AdminTable.types";
import { TransactionType } from "./transactionTypes";

export type TransactionDirection = "CREDIT" | "DEBIT";

export interface TransactionItem extends AdminTableRow {
  transactionId: string;
  walletId: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  signedAmount: number;
  relatedEntityId?: string;
  relatedEntityType?: string;
  groupId?: string;
  note?: string;
  metadata: Record<string, string>;
  createdAt: string;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminTransactionFilters {
  page: number;
  limit: number;
  walletId?: string;
  ownerId?: string;
  ownerType?: string;
  type?: TransactionType;
  direction?: TransactionDirection;
  relatedEntityId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAdminTransactionsResponse {
  success: boolean;
  message?: string;
  data: {
    transactions: TransactionItem[];
    pagination: TransactionPagination;
  };
}
