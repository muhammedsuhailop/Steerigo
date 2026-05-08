import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container";
import { AdminRideController } from "@interface/controllers/admin/AdminRideController";
import { validateSchema } from "@interface/middleware";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { TYPES } from "@shared/constants/DITypes";
import { getAdminRidesSchema } from "@application/dto/admin/GetAdminRidesDto";
import { getAdminRatingsSchema } from "@application/dto/admin/GetAdminRatingsDto";
import { getAdminRideByIdSchema } from "@interface/validators/admin/adminRideValidators";

const router = Router();

const adminRideController = container.get<AdminRideController>(
  TYPES.AdminRideController,
);

// GET /admin/rides
router.get(
  "/",
  validateSchema(getAdminRidesSchema),
  handleValidationErrors,
  (req: Request, res: Response) => adminRideController.getRides(req, res),
);

// GET /admin/rides/ratings
router.get(
  "/ratings",
  validateSchema(getAdminRatingsSchema),
  handleValidationErrors,
  (req: Request, res: Response) => adminRideController.getRatings(req, res),
);

// GET /admin/rides/:rideId
router.get(
  "/:rideId",
  validateSchema(getAdminRideByIdSchema),
  handleValidationErrors,
  (req: Request, res: Response) => adminRideController.getRideById(req, res),
);

export { router as adminRideRoutes };
