"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverRideRoutes = void 0;
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const middleware_1 = require("@interface/middleware");
const acceptFutureRideRequestValidator_1 = require("@interface/validators/driver/acceptFutureRideRequestValidator");
const driverCancelRideSchema_1 = require("@interface/validators/driver/driverCancelRideSchema");
const getFutureRideRequestsValidator_1 = require("@interface/validators/driver/getFutureRideRequestsValidator");
const rejectFutureRideRequestValidator_1 = require("@interface/validators/driver/rejectFutureRideRequestValidator");
const rideIdParamSchema_1 = require("@interface/validators/driver/rideIdParamSchema");
const rideRequestIdParamSchema_1 = require("@interface/validators/driver/rideRequestIdParamSchema");
const DITypes_1 = require("@shared/constants/DITypes");
const express_1 = require("express");
const driverRideRoutes = (0, express_1.Router)();
exports.driverRideRoutes = driverRideRoutes;
const driverRideController = DIContainer_1.container.get(DITypes_1.TYPES.DriverRideController);
const driverRideActionsController = DIContainer_1.container.get(DITypes_1.TYPES.DriverRideActionsController);
const driverScheduleRideController = DIContainer_1.container.get(DITypes_1.TYPES.DriverScheduleRideController);
// GET /api/driver/ride/rides - Get all rides with pagination and filters
driverRideRoutes.get("/rides", (req, res) => driverRideController.getDriverRides(req, res));
// POST /api/driver/ride/:requestId/accept - Accept ride request
driverRideRoutes.post("/:requestId/accept", (0, middleware_1.validateSchema)(rideRequestIdParamSchema_1.rideRequestIdParamSchema), (req, res) => driverRideController.acceptRideRequest(req, res));
// POST /api/driver/ride/:requestId/reject - Reject ride request
driverRideRoutes.post("/:requestId/reject", (0, middleware_1.validateSchema)(rideRequestIdParamSchema_1.rideRequestIdParamSchema), (req, res) => driverRideController.rejectRideRequest(req, res));
// GET /api/driver/ride/requests - Get all pending ride requests
driverRideRoutes.get("/requests", (req, res) => driverRideController.getPendingRideRequests(req, res));
// GET /api/driver/ride/future-requests
driverRideRoutes.get("/future-requests", (0, middleware_1.validateSchema)(getFutureRideRequestsValidator_1.getFutureRideRequestsSchema), (req, res) => driverScheduleRideController.getFutureRideRequests(req, res));
// POST /api/driver/ride/future-accept
driverRideRoutes.post("/future-accept", (0, middleware_1.validateSchema)(acceptFutureRideRequestValidator_1.acceptFutureRideRequestSchema), (req, res) => driverScheduleRideController.acceptFutureRideRequest(req, res));
// POST /api/driver/ride/future-reject
driverRideRoutes.post("/future-reject", (0, middleware_1.validateSchema)(rejectFutureRideRequestValidator_1.rejectFutureRideRequestSchema), (req, res) => driverScheduleRideController.rejectFutureRideRequest(req, res));
// GET /api/driver/ride/:rideId - Get driver ride details
driverRideRoutes.get("/:rideId", (0, middleware_1.validateSchema)(rideIdParamSchema_1.rideIdParamSchema), (req, res) => driverRideController.getDriverRideById(req, res));
// PATCH /api/driver/ride/:rideId/arrived - Mark ride as arrived
driverRideRoutes.patch("/:rideId/arrived", (0, middleware_1.validateSchema)(rideIdParamSchema_1.rideIdParamSchema), (req, res) => driverRideActionsController.markRideAsArrived(req, res));
// PATCH /api/driver/ride/:rideId/started - Mark ride as started
driverRideRoutes.patch("/:rideId/started", (0, middleware_1.validateSchema)(rideIdParamSchema_1.rideIdParamSchema), (req, res) => driverRideActionsController.markRideAsStarted(req, res));
// PATCH /api/driver/ride/:rideId/completed - Mark ride as completed
driverRideRoutes.patch("/:rideId/completed", (0, middleware_1.validateSchema)(rideIdParamSchema_1.rideIdParamSchema), (req, res) => driverRideActionsController.markRideAsCompleted(req, res));
// POST /api/driver/ride/:rideId/cancel - Driver cancels a ride
driverRideRoutes.post("/:rideId/cancel", (0, middleware_1.validateSchema)(driverCancelRideSchema_1.driverCancelRideSchema), (req, res) => driverRideActionsController.cancelRide(req, res));
//# sourceMappingURL=DriverRideRoutes.js.map