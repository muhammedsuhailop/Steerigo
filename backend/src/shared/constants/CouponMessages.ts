export const COUPON_ERROR_MESSAGES = {
  COUPON_NOT_FOUND: "Coupon '{{couponId}}' is invalid or expired",
  COUPON_CODE_EXISTS: "Coupon'{{code}}' already exists",
  INVALID_DISCOUNT_VALUE: "Invalid discount value: {{reason}}",
  INVALID_DISCOUNT_TYPE: "Invalid discount type: '{{discountType}}'",
  INVALID_VALIDITY_PERIOD: "validFrom must be before validTo",
  INVALID_COUPON_DATA: "Invalid coupon data: {{reason}}",
  COUPON_NOT_VALID: "Coupon '{{code}}' is expired or inactive",
  MINIMUM_AMOUNT_NOT_SATISFIED:
    "Minimum ride amount of {{minAmount}} is required. Current fare: {{rideAmount}}",
  COUPON_ALREADY_APPLIED: "A coupon is already applied to ride '{{rideId}}'",
  CANNOT_APPLY_COUPON_AFTER_PAYMENT:
    "Cannot apply coupon for ride {{rideId}} after payment is completed.",
  COUPON_USAGE_LIMIT_EXCEEDED:
    "You have already reached the maximum usage limit for coupon '{{code}}'.",
  NO_COUPON_APPLIED: "No coupon is applied to ride '{{rideId}}'",
} as const;

export const COUPON_MESSAGES = {
  CREATED: "Coupon created successfully",
  UPDATED: "Coupon updated successfully",
} as const;
