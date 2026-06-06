export declare const COUPON_ERROR_MESSAGES: {
    readonly COUPON_NOT_FOUND: "Coupon '{{couponId}}' is invalid or expired";
    readonly COUPON_CODE_EXISTS: "Coupon'{{code}}' already exists";
    readonly INVALID_DISCOUNT_VALUE: "Invalid discount value: {{reason}}";
    readonly INVALID_DISCOUNT_TYPE: "Invalid discount type: '{{discountType}}'";
    readonly INVALID_VALIDITY_PERIOD: "validFrom must be before validTo";
    readonly INVALID_COUPON_DATA: "Invalid coupon data: {{reason}}";
    readonly COUPON_NOT_VALID: "Coupon '{{code}}' is expired or inactive";
    readonly MINIMUM_AMOUNT_NOT_SATISFIED: "Minimum ride amount of {{minAmount}} is required. Current fare: {{rideAmount}}";
    readonly COUPON_ALREADY_APPLIED: "A coupon is already applied to ride '{{rideId}}'";
    readonly CANNOT_APPLY_COUPON_AFTER_PAYMENT: "Cannot apply coupon for ride {{rideId}} after payment is completed.";
    readonly COUPON_USAGE_LIMIT_EXCEEDED: "You have already reached the maximum usage limit for coupon '{{code}}'.";
    readonly NO_COUPON_APPLIED: "No coupon is applied to ride '{{rideId}}'";
};
export declare const COUPON_MESSAGES: {
    readonly CREATED: "Coupon created successfully";
    readonly UPDATED: "Coupon updated successfully";
};
//# sourceMappingURL=CouponMessages.d.ts.map