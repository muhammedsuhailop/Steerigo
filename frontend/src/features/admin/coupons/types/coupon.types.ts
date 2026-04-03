export type CouponDiscountType = "PERCENTAGE" | "FIXED";

export interface CouponData {
  couponId: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscount?: number;
  minRideAmount?: number;
  usageLimit?: number;
  usagePerUser?: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminCouponFilters {
  code?: string;
  discountType?: CouponDiscountType;
  isActive?: boolean;
  validFromStart?: string;
  validToEnd?: string;
  sortBy?: "code" | "discountValue" | "createdAt" | "validFrom" | "validTo";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface GetAdminCouponsResponse {
  success: boolean;
  data: {
    coupons: CouponData[];
    pagination: CouponPagination;
  };
}

export interface CreateCouponRequest {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number | "";
  maxDiscount?: number | "";
  minRideAmount?: number | "";
  usageLimit?: number | "";
  usagePerUser?: number | "";
  validFrom: string;
  validTo: string;
}

export interface CreateCouponResponse {
  success: boolean;
  message: string;
  data: {
    coupon: CouponData;
  };
}

export type CouponFormErrors = Partial<
  Record<keyof CreateCouponRequest, string>
>;
