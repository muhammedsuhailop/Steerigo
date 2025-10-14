import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  scheduleAvailabilitySchema,
  updateStatusSchema,
  updateLocationSchema,
} from "@interface/validators/driver/DriverAvailabilityValidators";
import { DriverAvailabilityController } from "@interface/controllers/driver/DriverAvailabilityController";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();

// Get controller instance from DI container
const driverAvailabilityController =
  container.get<DriverAvailabilityController>(
    TYPES.DriverAvailabilityController
  );

// POST /api/driver/availability/schedule - Schedule driver availability with location
router.post(
  "/schedule",
  validateSchema(scheduleAvailabilitySchema),
  (req, res) => driverAvailabilityController.scheduleAvailability(req, res)
);

// PUT /api/driver/availability/status - Update driver availability status
router.put("/status", validateSchema(updateStatusSchema), (req, res) =>
  driverAvailabilityController.updateStatus(req, res)
);

// PUT /api/driver/availability/update-location - Update driver current location
router.put(
  "/update-location",
  validateSchema(updateLocationSchema),
  (req, res) => driverAvailabilityController.updateLocation(req, res)
);

export { router as driverAvailabilityRoutes };
