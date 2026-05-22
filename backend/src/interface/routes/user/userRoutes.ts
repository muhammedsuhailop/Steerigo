import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { UserProfileController } from "@interface/controllers/user/UserProfileController";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import { TYPES } from "@shared/constants/DITypes";
import { getUserProfileValidation } from "@interface/validators";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { DriverSearchController } from "@interface/controllers/user/DriverSearchController";
import { validateSchema } from "@interface/middleware";
import { findNearbyDriversSearchSchema } from "@interface/validators/user/driverSearchValidators";
import { rideRoutes } from "./rideRoutes";
import { CouponController } from "@interface/controllers/user/CouponController";
import { UserRole } from "@shared/constants/AuthConstants";

const router = Router();

const userProfileController = container.get<UserProfileController>(
  TYPES.UserProfileController,
);

const driverSearchController = container.get<DriverSearchController>(
  TYPES.DriverSearchController,
);

const couponController = container.get<CouponController>(
  TYPES.CouponController,
);

router.use(authMiddleware);
router.use(requireRole([UserRole.RIDER]));

router.use(rideRoutes);

// GET /api/user/profile
router.get("/profile", (req: Request, res: Response) =>
  userProfileController.getProfile(req, res),
);

// PUT /api/user/profile
router.put("/profile", (req: Request, res: Response) =>
  userProfileController.updateProfile(req, res),
);

// POST /api/user/profile/register-as-driver
router.post(
  "/register-as-driver",
  getUserProfileValidation,
  (req: Request, res: Response) =>
    userProfileController.registerAsDriver(req, res),
);

// GET /api/user/coupons
router.get("/coupons", (req: Request, res: Response) =>
  couponController.getUserCoupons(req, res),
);

// GET /api/user/stats
router.get("/stats", (req: Request, res: Response) =>
  userProfileController.getMyStats(req, res),
);

// POST /api/drivers/search/nearby
router.post(
  "/search/nearby",
  validateSchema(findNearbyDriversSearchSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    driverSearchController.findNearbyDrivers(req, res),
);


export { router as userRoutes };
