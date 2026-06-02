"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverAvailabilityRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const DriverAvailabilityValidators_1 = require("@interface/validators/driver/DriverAvailabilityValidators");
const DITypes_1 = require("@shared/constants/DITypes");
const EditAvailabilityExceptionValidators_1 = require("@interface/validators/driver/EditAvailabilityExceptionValidators");
const updateBaseLocationValidator_1 = require("@interface/validators/driver/updateBaseLocationValidator");
const router = (0, express_1.Router)();
exports.driverAvailabilityRoutes = router;
// Get controller instance from DI container
const driverAvailabilityController = DIContainer_1.container.get(DITypes_1.TYPES.DriverAvailabilityController);
// POST /api/driver/availability/schedule - Schedule driver availability with location
router.post("/schedule", (0, ValidationMiddleware_1.validateSchema)(DriverAvailabilityValidators_1.scheduleRecurringAvailabilitySchema), (req, res) => driverAvailabilityController.scheduleAvailability(req, res));
// POST /api/driver/availability/exception - Add exception to driver availability
router.post("/exception", (0, ValidationMiddleware_1.validateSchema)(DriverAvailabilityValidators_1.addAvailabilityExceptionSchema), (req, res) => driverAvailabilityController.addException(req, res));
// PATCH /api/availability/exception/:exceptionId - Edit availability exception
router.patch("/exception/:exceptionId", (0, ValidationMiddleware_1.validateSchema)(EditAvailabilityExceptionValidators_1.editAvailabilityExceptionSchema), (req, res) => driverAvailabilityController.editException(req, res));
// DELETE /api/availability/exception/:exceptionId - Remove availability exception
router.delete("/exception/:exceptionId", (0, ValidationMiddleware_1.validateSchema)(EditAvailabilityExceptionValidators_1.removeAvailabilityExceptionSchema), (req, res) => driverAvailabilityController.removeException(req, res));
// PUT /api/driver/availability/status - Update driver availability status
router.put("/status", (0, ValidationMiddleware_1.validateSchema)(DriverAvailabilityValidators_1.updateStatusSchema), (req, res) => driverAvailabilityController.updateStatus(req, res));
// PUT /api/driver/availability/update-location - Update driver current location
router.put("/update-location", (0, ValidationMiddleware_1.validateSchema)(DriverAvailabilityValidators_1.updateLocationSchema), (req, res) => driverAvailabilityController.updateLocation(req, res));
// PUT /api/driver/availability/update-base-location - Update driver base location
router.put("/update-base-location", (0, ValidationMiddleware_1.validateSchema)(updateBaseLocationValidator_1.updateBaseLocationSchema), (req, res) => driverAvailabilityController.updateBaseLocation(req, res));
//# sourceMappingURL=DriverAvailabilityRoutes.js.map