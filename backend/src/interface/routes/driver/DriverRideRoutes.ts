import { container } from "@infrastructure/container/DIContainer";
import { DriverRideController } from "@interface/controllers/driver/DriverRideController";
import { TYPES } from "@shared/constants/DITypes";
import { Router } from "express";

const driverRideRoutes = Router();

const driverRideController = container.get<DriverRideController>(
  TYPES.DriverRideController,
);

// POST /api/driver/ride/:requestId/accept - Accept ride request
driverRideRoutes.post("/:requestId/accept", (req, res) =>
  driverRideController.acceptRideRequest(req, res),
);


// POST /api/driver/ride/:requestId/reject - Reject ride request
// driverRideRoutes.post(
//   "/:requestId/reject",
//   driverRideController.rejectRideRequest,
// );

export { driverRideRoutes };
