import { Payout } from "@domain/entities/Payout";
import { IPayoutRepository, PayoutQueryFilters, PayoutQueryResult } from "@domain/repositories/IPayoutRepository";
export declare class PayoutRepositoryImpl implements IPayoutRepository {
    save(payout: Payout): Promise<Payout>;
    findById(id: string): Promise<Payout | null>;
    findByDriverId(driverId: string): Promise<Payout[]>;
    exists(id: string): Promise<boolean>;
    findPendingByDriverId(driverId: string): Promise<Payout | null>;
    findAllWithFilters(filters: PayoutQueryFilters): Promise<PayoutQueryResult>;
}
//# sourceMappingURL=PayoutRepositoryImpl.d.ts.map