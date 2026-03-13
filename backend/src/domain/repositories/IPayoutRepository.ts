import { Payout } from "@domain/entities/Payout";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
export interface PayoutQueryFilters {
  status?: PayoutStatus;
  driverId?: string;
  page: number;
  limit: number;
  sortBy: "createdAt" | "amount";
  sortOrder: "asc" | "desc";
}

export interface PayoutQueryResult {
  payouts: Payout[];
  total: number;
  page: number;
  limit: number;
}

export interface IPayoutRepository extends IReadOnlyRepository<Payout> {
  save(payout: Payout): Promise<Payout>;
  findByDriverId(driverId: string): Promise<Payout[]>;
  findPendingByDriverId(driverId: string): Promise<Payout | null>;
  findAllWithFilters(filters: PayoutQueryFilters): Promise<PayoutQueryResult>;
}
