import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { AdminPayoutController } from "@interface/controllers/admin/AdminPayoutController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  approvePayoutSchema,
  rejectPayoutSchema,
  getAdminPayoutsSchema,
} from "@interface/validators/payment/payoutValidators";

const router = Router();
const controller = container.get<AdminPayoutController>(
  TYPES.AdminPayoutController,
);

// GET /api/admin/payouts
router.get("/", validateSchema(getAdminPayoutsSchema), (req, res) =>
  controller.getPayouts(req, res),
);

// PATCH /api/admin/payouts/:payoutId/approve
router.patch(
  "/:payoutId/approve",
  validateSchema(approvePayoutSchema),
  (req, res) => controller.approvePayout(req, res),
);

// PATCH /api/admin/payouts/:payoutId/reject
router.patch(
  "/:payoutId/reject",
  validateSchema(rejectPayoutSchema),
  (req, res) => controller.rejectPayout(req, res),
);

export { router as adminPayoutRoutes };
