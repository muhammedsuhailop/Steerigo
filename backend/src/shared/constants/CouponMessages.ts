export const COUPON_ERROR_MESSAGES = {
  COUPON_NOT_FOUND: "Coupon with ID '{{couponId}}' not found",
  COUPON_CODE_EXISTS: "Coupon with code '{{code}}' already exists",
  INVALID_DISCOUNT_VALUE: "Invalid discount value: {{reason}}",
  INVALID_DISCOUNT_TYPE: "Invalid discount type: '{{discountType}}'",
  INVALID_VALIDITY_PERIOD: "validFrom must be before validTo",
  INVALID_COUPON_DATA: "Invalid coupon data: {{reason}}",
} as const;

export const COUPON_MESSAGES = {
  CREATED: "Coupon created successfully",
  UPDATED: "Coupon updated successfully",
} as const;
