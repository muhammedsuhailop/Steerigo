import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { RideController } from "@interface/controllers/user/RideController";
import { AutoRideController } from "@interface/controllers/user/AutoRideController";
import { validateSchema } from "@interface/middleware";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { sendRideRequestSchema } from "@interface/validators/user/rideRequestValidators";
import { autoSearchAndRequestSchema } from "@interface/validators/user/autoSearchAndRequestValidators";
import { rideIdParamSchema } from "@interface/validators/user/rideIdParamSchema";
import { getUserRidesSchema } from "@interface/validators/user/getUserRidesSchema";

const router = Router();

const rideRequestController = container.get<RideController>(
  TYPES.RideController,
);

const autoRideController = container.get<AutoRideController>(
  TYPES.AutoRideController,
);

const rideController = container.get<RideController>(TYPES.RideController);

// POST /api/users/ride/request-send
router.post(
  "/ride/request-send",
  validateSchema(sendRideRequestSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    rideRequestController.sendRideRequest(req, res),
);

// POST /api/user/ride/auto-request-send
router.post(
  "/ride/auto-request-send",
  validateSchema(autoSearchAndRequestSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    autoRideController.autoSearchAndSendRequests(req, res),
);

// POST /api/user/ride/request-cancel
router.post("/ride/request-cancel", (req: Request, res: Response) =>
  autoRideController.cancelRideRequests(req, res),
);

// GET /api/user/ride/rides
router.get(
  "/ride/rides",
  validateSchema(getUserRidesSchema),
  handleValidationErrors,
  (req: Request, res: Response) => rideController.getUserRides(req, res),
);

// GET /api/user/ride/:rideId - Get specific ride details
router.get("/ride/:rideId", validateSchema(rideIdParamSchema), (req, res) =>
  rideController.getUserRideById(req, res),
);

export { router as rideRoutes };
