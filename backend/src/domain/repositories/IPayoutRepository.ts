import { Payout } from "@domain/entities/Payout";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";

export interface IPayoutRepository extends IReadOnlyRepository<Payout> {
  save(payout: Payout): Promise<Payout>;
  findByDriverId(driverId: string): Promise<Payout[]>;
}
