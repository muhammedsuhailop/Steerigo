import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { DriverPayoutController } from "@interface/controllers/driver/DriverPayoutController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import { UserRole } from "@shared/constants/AuthConstants";
import { requestPayoutSchema } from "@interface/validators/payment/payoutValidators";

const router = Router();
const controller = container.get<DriverPayoutController>(
  TYPES.DriverPayoutController,
);

router.use(authMiddleware);
router.use(requireRole([UserRole.DRIVER]));

// POST /api/driver/payouts/request
router.post("/request", validateSchema(requestPayoutSchema), (req, res) =>
  controller.requestPayout(req, res),
);

// GET /api/driver/payouts
router.get("/", (req, res) => controller.getMyPayouts(req, res));

export { router as driverPayoutRoutes };
