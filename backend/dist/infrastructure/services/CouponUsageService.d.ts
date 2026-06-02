import { ICouponUsageRepository } from "@domain/repositories/ICouponUsageRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { ICouponUsageService } from "@application/services/ICouponUsageService";
import { IIdGenerator } from "@application/services/IIdGenerator";
export declare class CouponUsageService implements ICouponUsageService {
    private readonly rideRepository;
    private readonly couponUsageRepository;
    private readonly idGenerator;
    constructor(rideRepository: IRideRepository, couponUsageRepository: ICouponUsageRepository, idGenerator: IIdGenerator);
    recordUsage(rideId: string): Promise<void>;
}
//# sourceMappingURL=CouponUsageService.d.ts.map