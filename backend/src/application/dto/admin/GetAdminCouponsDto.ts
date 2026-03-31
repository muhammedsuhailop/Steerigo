import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import {
  CouponSortField,
  SortOrder,
  CouponFilters,
} from "@domain/repositories/ICouponRepository";
import { CouponErrors } from "@domain/errors/CouponErrors";

const VALID_SORT_FIELDS: CouponSortField[] = [
  "code",
  "discountValue",
  "createdAt",
  "validFrom",
  "validTo",
];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT_FIELD: CouponSortField = "createdAt";
const DEFAULT_SORT_ORDER: SortOrder = "desc";

interface GetAdminCouponsQuery {
  code?: string;
  discountType?: string;
  isActive?: string;
  validFromStart?: string;
  validFromEnd?: string;
  validToStart?: string;
  validToEnd?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

export class GetAdminCouponsDto {
  public readonly filters: CouponFilters;
  public readonly sortBy: CouponSortField;
  public readonly sortOrder: SortOrder;
  public readonly page: number;
  public readonly limit: number;

  private constructor(
    filters: CouponFilters,
    sortBy: CouponSortField,
    sortOrder: SortOrder,
    page: number,
    limit: number,
  ) {
    this.filters = filters;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.page = page;
    this.limit = limit;
  }

  static fromRequest(query: unknown): GetAdminCouponsDto {
    const q = (query ?? {}) as GetAdminCouponsQuery;

    const filters: CouponFilters = {};

    if (q.code && q.code.trim().length > 0) {
      filters.code = q.code.trim();
    }

    if (q.discountType) {
      if (
        !Object.values(CouponDiscountType).includes(
          q.discountType as CouponDiscountType,
        )
      ) {
        throw CouponErrors.invalidDiscountType(q.discountType);
      }
      filters.discountType = q.discountType as CouponDiscountType;
    }

    if (q.isActive !== undefined) {
      if (q.isActive !== "true" && q.isActive !== "false") {
        throw CouponErrors.invalidCouponData(
          "isActive must be 'true' or 'false'",
        );
      }
      filters.isActive = q.isActive === "true";
    }

    const parseOptionalDate = (
      val: string | undefined,
      fieldName: string,
    ): Date | undefined => {
      if (!val) return undefined;
      const d = new Date(val);
      if (isNaN(d.getTime())) {
        throw CouponErrors.invalidCouponData(
          `${fieldName} is not a valid date`,
        );
      }
      return d;
    };

    filters.validFromStart = parseOptionalDate(
      q.validFromStart,
      "validFromStart",
    );
    filters.validFromEnd = parseOptionalDate(q.validFromEnd, "validFromEnd");
    filters.validToStart = parseOptionalDate(q.validToStart, "validToStart");
    filters.validToEnd = parseOptionalDate(q.validToEnd, "validToEnd");

    if (
      filters.validFromStart &&
      filters.validFromEnd &&
      filters.validFromStart > filters.validFromEnd
    ) {
      throw CouponErrors.invalidCouponData(
        "validFromStart must be before validFromEnd",
      );
    }

    if (
      filters.validToStart &&
      filters.validToEnd &&
      filters.validToStart > filters.validToEnd
    ) {
      throw CouponErrors.invalidCouponData(
        "validToStart must be before validToEnd",
      );
    }

    const sortBy: CouponSortField =
      q.sortBy && VALID_SORT_FIELDS.includes(q.sortBy as CouponSortField)
        ? (q.sortBy as CouponSortField)
        : DEFAULT_SORT_FIELD;

    const sortOrder: SortOrder =
      q.sortOrder === "asc" || q.sortOrder === "desc"
        ? q.sortOrder
        : DEFAULT_SORT_ORDER;

    const page = q.page ? Math.max(1, parseInt(q.page, 10)) : DEFAULT_PAGE;
    const limit = q.limit
      ? Math.min(MAX_LIMIT, Math.max(1, parseInt(q.limit, 10)))
      : DEFAULT_LIMIT;

    if (isNaN(page)) {
      throw CouponErrors.invalidCouponData("page must be a valid number");
    }
    if (isNaN(limit)) {
      throw CouponErrors.invalidCouponData("limit must be a valid number");
    }

    return new GetAdminCouponsDto(filters, sortBy, sortOrder, page, limit);
  }
}
