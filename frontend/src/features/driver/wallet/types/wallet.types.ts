import { TransactionDirection, TransactionType } from "@/shared/types/payment.types";

export interface Transaction {
  id: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  relatedEntityId: string;
  relatedEntityType: string;
  note: string;
  createdAt: string;
}

export interface WalletData {
  walletId: string;
  driverId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  updatedAt: string;
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: WalletData;
}

export interface WalletFilters {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  type?: TransactionType;
  direction?: TransactionDirection;
  fromDate?: string;
  toDate?: string;
}
