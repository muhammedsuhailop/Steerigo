import { container } from "@infrastructure/container/DIContainer";
import { DriverRideController } from "@interface/controllers/driver/DriverRideController";
import { validateSchema } from "@interface/middleware";
import { rideRequestIdParamSchema } from "@interface/validators/driver/rideRequestIdParamSchema";
import { TYPES } from "@shared/constants/DITypes";
import { Router } from "express";

const driverRideRoutes = Router();

const driverRideController = container.get<DriverRideController>(
  TYPES.DriverRideController,
);

// GET /api/driver/ride - Get all rides with pagination and filters
driverRideRoutes.get("/", (req, res) =>
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
export { driverRideRoutes };
