import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { PaymentController } from "@interface/controllers/payment/PaymentController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import { UserRole } from "@shared/constants/AuthConstants";

import {
  initiatePaymentSchema,
  verifyPaymentSchema,
  confirmCashPaymentSchema,
} from "@interface/validators/payment/paymentValidators";

const router = Router();

const controller = container.get<PaymentController>(TYPES.PaymentController);

router.use(authMiddleware);

// POST /api/payment/initiate
router.post(
  "/initiate",
  requireRole([UserRole.RIDER]),
  validateSchema(initiatePaymentSchema),
  (req, res) => controller.initiatePayment(req, res),
);

// POST /api/payment/verify
router.post(
  "/verify",
  requireRole([UserRole.RIDER]),
  validateSchema(verifyPaymentSchema),
  (req, res) => controller.verifyPayment(req, res),
);

// POST /api/payment/confirm-cash
router.post(
  "/confirm-cash",
  requireRole([UserRole.DRIVER]),
  validateSchema(confirmCashPaymentSchema),
  (req, res) => controller.confirmCashPayment(req, res),
);

export { router as paymentRoutes };
