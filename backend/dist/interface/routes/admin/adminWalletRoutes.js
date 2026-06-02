"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminWalletRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const errorHandler_1 = require("@interface/middleware/errorHandler");
const adminWalletValidators_1 = require("@interface/validators/admin/adminWalletValidators");
const router = (0, express_1.Router)();
exports.adminWalletRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.AdminWalletController);
// GET /api/admin/wallet
router.get("/", (0, ValidationMiddleware_1.validateSchema)(adminWalletValidators_1.getAdminWalletSchema), errorHandler_1.handleValidationErrors, (req, res) => controller.getWallet(req, res));
//# sourceMappingURL=adminWalletRoutes.js.map