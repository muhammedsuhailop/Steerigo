"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const AuthMiddleware_1 = require("@interface/middleware/auth/AuthMiddleware");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const paymentValidators_1 = require("@interface/validators/payment/paymentValidators");
const router = (0, express_1.Router)();
exports.paymentRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.PaymentController);
router.use(AuthMiddleware_1.authMiddleware);
// POST /api/payment/initiate
router.post("/initiate", (0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.RIDER]), (0, ValidationMiddleware_1.validateSchema)(paymentValidators_1.initiatePaymentSchema), (req, res) => controller.initiatePayment(req, res));
// POST /api/payment/verify
router.post("/verify", (0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.RIDER]), (0, ValidationMiddleware_1.validateSchema)(paymentValidators_1.verifyPaymentSchema), (req, res) => controller.verifyPayment(req, res));
// POST /api/payment/confirm-cash
router.post("/confirm-cash", (0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.DRIVER]), (0, ValidationMiddleware_1.validateSchema)(paymentValidators_1.confirmCashPaymentSchema), (req, res) => controller.confirmCashPayment(req, res));
// POST /api/payment/mark-failed
router.post("/mark-failed", (0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.RIDER]), (0, ValidationMiddleware_1.validateSchema)(paymentValidators_1.markPaymentFailedValidatorSchema), (req, res) => controller.markPaymentFailed(req, res));
//# sourceMappingURL=paymentRoutes.js.map