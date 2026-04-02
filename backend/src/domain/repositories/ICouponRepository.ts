import { Coupon } from "@domain/entities/Coupon";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";

export interface CouponFilters {
  code?: string;
  discountType?: CouponDiscountType;
  isActive?: boolean;
  validFromStart?: Date;
  validFromEnd?: Date;
  validToStart?: Date;
  validToEnd?: Date;
}

export type CouponSortField =
  | "code"
  | "discountValue"
  | "createdAt"
  | "validFrom"
  | "validTo";

export type SortOrder = "asc" | "desc";

export interface CouponQueryOptions {
  filters: CouponFilters;
  sortBy: CouponSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export interface PaginatedCoupons {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICouponRepository extends IReadOnlyRepository<Coupon> {
  save(coupon: Coupon): Promise<Coupon>;

  findByCode(code: string): Promise<Coupon | null>;

  findAll(options: CouponQueryOptions): Promise<PaginatedCoupons>;
}
