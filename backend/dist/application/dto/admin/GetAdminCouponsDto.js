"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminCouponsDto = void 0;
const CouponDiscountType_1 = require("@domain/value-objects/CouponDiscountType");
const CouponErrors_1 = require("@domain/errors/CouponErrors");
const VALID_SORT_FIELDS = [
    "code",
    "discountValue",
    "createdAt",
    "validFrom",
    "validTo",
];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT_FIELD = "createdAt";
const DEFAULT_SORT_ORDER = "desc";
class GetAdminCouponsDto {
    constructor(filters, sortBy, sortOrder, page, limit) {
        this.filters = filters;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.limit = limit;
    }
    static fromRequest(query) {
        const q = (query ?? {});
        const filters = {};
        if (q.code && q.code.trim().length > 0) {
            filters.code = q.code.trim();
        }
        if (q.discountType) {
            if (!Object.values(CouponDiscountType_1.CouponDiscountType).includes(q.discountType)) {
                throw CouponErrors_1.CouponErrors.invalidDiscountType(q.discountType);
            }
            filters.discountType = q.discountType;
        }
        if (q.isActive !== undefined) {
            if (q.isActive !== "true" && q.isActive !== "false") {
                throw CouponErrors_1.CouponErrors.invalidCouponData("isActive must be 'true' or 'false'");
            }
            filters.isActive = q.isActive === "true";
        }
        const parseOptionalDate = (val, fieldName) => {
            if (!val)
                return undefined;
            const d = new Date(val);
            if (isNaN(d.getTime())) {
                throw CouponErrors_1.CouponErrors.invalidCouponData(`${fieldName} is not a valid date`);
            }
            return d;
        };
        filters.validFromStart = parseOptionalDate(q.validFromStart, "validFromStart");
        filters.validFromEnd = parseOptionalDate(q.validFromEnd, "validFromEnd");
        filters.validToStart = parseOptionalDate(q.validToStart, "validToStart");
        filters.validToEnd = parseOptionalDate(q.validToEnd, "validToEnd");
        if (filters.validFromStart &&
            filters.validFromEnd &&
            filters.validFromStart > filters.validFromEnd) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("validFromStart must be before validFromEnd");
        }
        if (filters.validToStart &&
            filters.validToEnd &&
            filters.validToStart > filters.validToEnd) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("validToStart must be before validToEnd");
        }
        const sortBy = q.sortBy && VALID_SORT_FIELDS.includes(q.sortBy)
            ? q.sortBy
            : DEFAULT_SORT_FIELD;
        const sortOrder = q.sortOrder === "asc" || q.sortOrder === "desc"
            ? q.sortOrder
            : DEFAULT_SORT_ORDER;
        const page = q.page ? Math.max(1, parseInt(q.page, 10)) : DEFAULT_PAGE;
        const limit = q.limit
            ? Math.min(MAX_LIMIT, Math.max(1, parseInt(q.limit, 10)))
            : DEFAULT_LIMIT;
        if (isNaN(page)) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("page must be a valid number");
        }
        if (isNaN(limit)) {
            throw CouponErrors_1.CouponErrors.invalidCouponData("limit must be a valid number");
        }
        return new GetAdminCouponsDto(filters, sortBy, sortOrder, page, limit);
    }
}
exports.GetAdminCouponsDto = GetAdminCouponsDto;
//# sourceMappingURL=GetAdminCouponsDto.js.map