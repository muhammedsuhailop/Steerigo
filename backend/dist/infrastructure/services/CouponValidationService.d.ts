import { ICouponRepository } from "../../domain/repositories/ICouponRepository";
import { CouponValidationResult, ICouponValidationService } from "../../application/services/ICouponValidationService";
import { ICouponUsageRepository } from "../../domain/repositories/ICouponUsageRepository";
export declare class CouponValidationService implements ICouponValidationService {
    private readonly couponRepository;
    private readonly couponUsageRepository;
    constructor(couponRepository: ICouponRepository, couponUsageRepository: ICouponUsageRepository);
    validateAndCalculate(code: string, rideAmount: number, userId: string, currentDate: Date): Promise<CouponValidationResult>;
}
//# sourceMappingURL=CouponValidationService.d.ts.map