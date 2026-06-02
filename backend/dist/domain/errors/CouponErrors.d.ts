import { DomainError } from "./DomainError";
export declare class CouponErrors {
    static couponNotFound(couponId: string): DomainError;
    static couponCodeAlreadyExists(code: string): DomainError;
    static invalidDiscountValue(reason: string): DomainError;
    static invalidDiscountType(discountType: string): DomainError;
    static invalidValidityPeriod(): DomainError;
    static invalidCouponData(reason: string): DomainError;
    static couponNotValid(code: string): DomainError;
    static minimumAmountNotSatisfied(minAmount: number, rideAmount: number): DomainError;
    static couponAlreadyAppliedToRide(rideId: string): DomainError;
    static cannotApplyCouponAfterPayment(rideId: string): DomainError;
    static couponUsageLimitExceeded(code: string): DomainError;
    static noCouponApplied(rideId: string): DomainError;
}
//# sourceMappingURL=CouponErrors.d.ts.map