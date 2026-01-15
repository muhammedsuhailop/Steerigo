import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { UserProfileController } from "@interface/controllers/user/UserProfileController";
import { authMiddleware } from "@interface/middleware/auth/AuthMiddleware";
import { TYPES } from "@shared/constants/DITypes";
import { getUserProfileValidation } from "@interface/validators";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { DriverSearchController } from "@interface/controllers/user/DriverSearchController";
import { validateSchema } from "@interface/middleware";
import { findNearbyDriversSearchSchema } from "@interface/validators/user/driverSearchValidators";
import { sendRideRequestSchema } from "@interface/validators/user/rideRequestValidators";
import { RideController } from "@interface/controllers/user/RideController";
import { autoSearchAndRequestSchema } from "@interface/validators/user/autoSearchAndRequestValidators";
import { AutoRideController } from "@interface/controllers/user/AutoRideController";

const router = Router();
const userProfileController = container.get<UserProfileController>(
  TYPES.UserProfileController
);

const driverSearchController = container.get<DriverSearchController>(
  TYPES.DriverSearchController
);

const rideRequestController = container.get<RideController>(
  TYPES.RideController
);

const autoRideController = container.get<AutoRideController>(TYPES.AutoRideController);


router.use(authMiddleware);

// GET /api/user/profile/:userId
router.get("/profile/:userId", (req: Request, res: Response) =>
  userProfileController.getProfile(req, res)
);

// PUT /api/user/profile/:userId
router.put("/profile/:userId", (req: Request, res: Response) =>
  userProfileController.updateProfile(req, res)
);

// POST /api/user/profile/:userId/register-as-driver
router.post(
  "/:userId/register-as-driver",
  getUserProfileValidation,
  (req: Request, res: Response) =>
    userProfileController.registerAsDriver(req, res)
);

//POST /api/drivers/search/nearby
router.post(
  "/search/nearby",
  validateSchema(findNearbyDriversSearchSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    driverSearchController.findNearbyDrivers(req, res)
);

//POST /api/users/ride/request-send
router.post(
  "/ride/request-send",
  validateSchema(sendRideRequestSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    rideRequestController.sendRideRequest(req, res)
);

// POST /api/user/ride/auto-request-send
router.post(
  "/ride/auto-request-send",
  validateSchema(autoSearchAndRequestSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    autoRideController.autoSearchAndSendRequests(req, res)
);

export { router as userRoutes };
