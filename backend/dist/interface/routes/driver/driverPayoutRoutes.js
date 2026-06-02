"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverPayoutRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const AuthMiddleware_1 = require("@interface/middleware/auth/AuthMiddleware");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const payoutValidators_1 = require("@interface/validators/payment/payoutValidators");
const router = (0, express_1.Router)();
exports.driverPayoutRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.DriverPayoutController);
router.use(AuthMiddleware_1.authMiddleware);
router.use((0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.DRIVER]));
// POST /api/driver/payouts/request
router.post("/request", (0, ValidationMiddleware_1.validateSchema)(payoutValidators_1.requestPayoutSchema), (req, res) => controller.requestPayout(req, res));
// GET /api/driver/payouts
router.get("/", (req, res) => controller.getMyPayouts(req, res));
//# sourceMappingURL=driverPayoutRoutes.js.map