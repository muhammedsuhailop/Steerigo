import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container";
import { AdminRideController } from "@interface/controllers/admin/AdminRideController";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import { validateSchema } from "@interface/middleware";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { TYPES } from "@shared/constants/DITypes";
import { getAdminRidesSchema } from "@application/dto/admin/GetAdminRidesDto";

const router = Router();

const adminRideController = container.get<AdminRideController>(
  TYPES.AdminRideController,
);

router.use(authMiddleware);
router.use(requireRole(["Admin"]));

// GET /admin/rides
router.get(
  "/",
  validateSchema(getAdminRidesSchema),
  handleValidationErrors,
  (req: Request, res: Response) => adminRideController.getRides(req, res),
);

export { router as adminRideRoutes };
