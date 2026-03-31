import { CouponData } from "./CreateCouponResponseDto";

export interface CouponPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAdminCouponsResponseDto {
  success: boolean;
  data: {
    coupons: CouponData[];
    pagination: CouponPagination;
  };
}
