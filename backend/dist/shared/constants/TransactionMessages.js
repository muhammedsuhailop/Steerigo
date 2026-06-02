"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_ERROR_MESSAGES = exports.TRANSACTION__MESSAGES = void 0;
exports.TRANSACTION__MESSAGES = {
    FETCHED: "Transactions fetched successfully",
};
exports.TRANSACTION_ERROR_MESSAGES = {
    TRANSACTION_NOT_FOUND: "Transaction '{{transactionId}}' not found",
    INVALID_TRANSACTION_TYPE: "'{{type}}' is not a valid transaction type",
    INVALID_TRANSACTION_DIRECTION: "'{{direction}}' is not a valid transaction direction",
    INVALID_OWNER_TYPE: "'{{ownerType}}' is not a valid wallet owner type",
    INVALID_DATE_FIELD: "'{{fieldName}}' is not a valid date",
    INVALID_DATE_RANGE: "'fromDate' must be before 'toDate'",
    INVALID_PAGINATION_FIELD: "'{{fieldName}}' must be a valid positive number",
};
//# sourceMappingURL=TransactionMessages.js.map