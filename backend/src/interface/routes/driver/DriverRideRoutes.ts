import { container } from "@infrastructure/container/DIContainer";
import { DriverRideActionsController } from "@interface/controllers/driver/DriverRideActionsController";
import { DriverRideController } from "@interface/controllers/driver/DriverRideController";
import { validateSchema } from "@interface/middleware";
import { rideIdParamSchema } from "@interface/validators/driver/rideIdParamSchema";
import { rideRequestIdParamSchema } from "@interface/validators/driver/rideRequestIdParamSchema";
import { TYPES } from "@shared/constants/DITypes";
import { Router } from "express";

const driverRideRoutes = Router();

const driverRideController = container.get<DriverRideController>(
  TYPES.DriverRideController,
);

const driverRideActionsController = container.get<DriverRideActionsController>(
  TYPES.DriverRideActionsController,
);

// GET /api/driver/ride/rides - Get all rides with pagination and filters
driverRideRoutes.get("/rides", (req, res) =>
  driverRideController.getDriverRides(req, res),
);

// POST /api/driver/ride/:requestId/accept - Accept ride request
driverRideRoutes.post(
  "/:requestId/accept",
  validateSchema(rideRequestIdParamSchema),
  (req, res) => driverRideController.acceptRideRequest(req, res),
);

// POST /api/driver/ride/:requestId/reject - Reject ride request
driverRideRoutes.post(
  "/:requestId/reject",
  validateSchema(rideRequestIdParamSchema),
  (req, res) => driverRideController.rejectRideRequest(req, res),
);

// GET /api/driver/ride/requests - Get all pending ride requests
driverRideRoutes.get("/requests", (req, res) =>
  driverRideController.getPendingRideRequests(req, res),
);

// GET /api/driver/ride/:rideId - Get driver ride details
driverRideRoutes.get(
  "/:rideId",
  validateSchema(rideIdParamSchema),
  (req, res) => driverRideController.getDriverRideById(req, res),
);

// PATCH /api/driver/ride/:rideId/arrived - Mark ride as arrived
driverRideRoutes.patch(
  "/:rideId/arrived",
  validateSchema(rideIdParamSchema),
  (req, res) => driverRideActionsController.markRideAsArrived(req, res),
);

// PATCH /api/driver/ride/:rideId/started - Mark ride as started
driverRideRoutes.patch(
  "/:rideId/started",
  validateSchema(rideIdParamSchema),
  (req, res) => driverRideActionsController.markRideAsStarted(req, res),
);
export { driverRideRoutes };
