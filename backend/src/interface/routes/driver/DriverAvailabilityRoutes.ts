import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  scheduleRecurringAvailabilitySchema,
  updateStatusSchema,
  updateLocationSchema,
  addAvailabilityExceptionSchema,
} from "@interface/validators/driver/DriverAvailabilityValidators";

import { DriverAvailabilityController } from "@interface/controllers/driver/DriverAvailabilityController";
import { TYPES } from "@shared/constants/DITypes";
import {
  editAvailabilityExceptionSchema,
  removeAvailabilityExceptionSchema,
} from "@interface/validators/driver/EditAvailabilityExceptionValidators";
import { updateBaseLocationSchema } from "@interface/validators/driver/updateBaseLocationValidator";

const router = Router();

// Get controller instance from DI container
const driverAvailabilityController =
  container.get<DriverAvailabilityController>(
    TYPES.DriverAvailabilityController,
  );

// POST /api/driver/availability/schedule - Schedule driver availability with location
router.post(
  "/schedule",
  validateSchema(scheduleRecurringAvailabilitySchema),
  (req, res) => driverAvailabilityController.scheduleAvailability(req, res),
);

// POST /api/driver/availability/exception - Add exception to driver availability
router.post(
  "/exception",
  validateSchema(addAvailabilityExceptionSchema),
  (req, res) => driverAvailabilityController.addException(req, res),
);

// PATCH /api/availability/exception/:exceptionId - Edit availability exception
router.patch(
  "/exception/:exceptionId",
  validateSchema(editAvailabilityExceptionSchema),
  (req, res) => driverAvailabilityController.editException(req, res),
);

// DELETE /api/availability/exception/:exceptionId - Remove availability exception
router.delete(
  "/exception/:exceptionId",
  validateSchema(removeAvailabilityExceptionSchema),
  (req, res) => driverAvailabilityController.removeException(req, res),
);

// PUT /api/driver/availability/status - Update driver availability status
router.put("/status", validateSchema(updateStatusSchema), (req, res) =>
  driverAvailabilityController.updateStatus(req, res),
);

// PUT /api/driver/availability/update-location - Update driver current location
router.put(
  "/update-location",
  validateSchema(updateLocationSchema),
  (req, res) => driverAvailabilityController.updateLocation(req, res),
);

// PUT /api/driver/availability/update-base-location - Update driver base location
router.put(
  "/update-base-location",
  validateSchema(updateBaseLocationSchema),
  (req, res) => driverAvailabilityController.updateBaseLocation(req, res),
);

export { router as driverAvailabilityRoutes };
