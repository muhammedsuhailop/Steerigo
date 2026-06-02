"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTransactionRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const transactionValidators_1 = require("@interface/validators/admin/transactionValidators");
const router = (0, express_1.Router)();
exports.adminTransactionRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.AdminTransactionController);
// GET /api/admin/transactions
router.get("/", (0, ValidationMiddleware_1.validateSchema)(transactionValidators_1.getAdminTransactionsSchema), (req, res) => controller.getTransactions(req, res));
//# sourceMappingURL=adminTransactionRoutes.js.map