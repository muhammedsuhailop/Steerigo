"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminTransactionsDto = void 0;
const TransactionType_1 = require("@domain/value-objects/TransactionType");
const TransactionDirection_1 = require("@domain/value-objects/TransactionDirection");
const WalletOwnerType_1 = require("@domain/value-objects/WalletOwnerType");
const TransactionErrors_1 = require("@domain/errors/TransactionErrors");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 60;
class GetAdminTransactionsDto {
    constructor(filters) {
        this.filters = filters;
    }
    static fromRequest(query) {
        const q = (query ?? {});
        if (q.type &&
            !Object.values(TransactionType_1.TransactionType).includes(q.type)) {
            throw TransactionErrors_1.TransactionErrors.invalidTransactionType(q.type);
        }
        if (q.direction &&
            !Object.values(TransactionDirection_1.TransactionDirection).includes(q.direction)) {
            throw TransactionErrors_1.TransactionErrors.invalidTransactionDirection(q.direction);
        }
        if (q.ownerType &&
            !Object.values(WalletOwnerType_1.WalletOwnerType).includes(q.ownerType)) {
            throw TransactionErrors_1.TransactionErrors.invalidOwnerType(q.ownerType);
        }
        const parseOptionalDate = (val, fieldName) => {
            if (!val)
                return undefined;
            const d = new Date(val);
            if (isNaN(d.getTime())) {
                throw TransactionErrors_1.TransactionErrors.invalidDateField(fieldName);
            }
            return d;
        };
        const fromDate = parseOptionalDate(q.fromDate, "fromDate");
        const toDate = parseOptionalDate(q.toDate, "toDate");
        if (fromDate && toDate && fromDate > toDate) {
            throw TransactionErrors_1.TransactionErrors.invalidDateRange();
        }
        const rawSearch = q.search?.trim();
        const search = rawSearch && rawSearch.length > 0
            ? rawSearch.slice(0, MAX_SEARCH_LENGTH)
            : undefined;
        const sortBy = q.sortBy === "amount" ? "amount" : "createdAt";
        const sortOrder = q.sortOrder === "asc" ? "asc" : "desc";
        const rawPage = q.page ? parseInt(q.page, 10) : DEFAULT_PAGE;
        const rawLimit = q.limit ? parseInt(q.limit, 10) : DEFAULT_LIMIT;
        if (isNaN(rawPage) || rawPage < 1) {
            throw TransactionErrors_1.TransactionErrors.invalidPaginationField("page");
        }
        if (isNaN(rawLimit) || rawLimit < 1) {
            throw TransactionErrors_1.TransactionErrors.invalidPaginationField("limit");
        }
        const page = Math.max(1, rawPage);
        const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
        const filters = {
            walletId: q.walletId?.trim() || undefined,
            ownerId: q.ownerId?.trim() || undefined,
            ownerType: q.ownerType ? q.ownerType : undefined,
            type: q.type ? q.type : undefined,
            direction: q.direction
                ? q.direction
                : undefined,
            relatedEntityId: q.relatedEntityId?.trim() || undefined,
            relatedEntityType: q.relatedEntityType?.trim() || undefined,
            fromDate,
            toDate,
            sortBy,
            search,
            sortOrder,
            page,
            limit,
        };
        return new GetAdminTransactionsDto(filters);
    }
}
exports.GetAdminTransactionsDto = GetAdminTransactionsDto;
//# sourceMappingURL=GetAdminTransactionsDto.js.map