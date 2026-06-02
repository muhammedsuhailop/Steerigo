"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const middleware_1 = require("@interface/middleware");
const errorHandler_1 = require("@interface/middleware/errorHandler");
const rideRequestValidators_1 = require("@interface/validators/user/rideRequestValidators");
const autoSearchAndRequestValidators_1 = require("@interface/validators/user/autoSearchAndRequestValidators");
const rideIdParamSchema_1 = require("@interface/validators/user/rideIdParamSchema");
const getUserRidesSchema_1 = require("@interface/validators/user/getUserRidesSchema");
const cancelRideSchema_1 = require("@interface/validators/user/cancelRideSchema");
const rateRideSchema_1 = require("@interface/validators/user/rateRideSchema");
const couponSchema_1 = require("@interface/validators/user/couponSchema");
const scheduleFutureRideValidators_1 = require("@interface/validators/user/scheduleFutureRideValidators");
const router = (0, express_1.Router)();
exports.rideRoutes = router;
const rideRequestController = DIContainer_1.container.get(DITypes_1.TYPES.RideController);
const autoRideController = DIContainer_1.container.get(DITypes_1.TYPES.AutoRideController);
const rideController = DIContainer_1.container.get(DITypes_1.TYPES.RideController);
const couponController = DIContainer_1.container.get(DITypes_1.TYPES.CouponController);
// POST /api/users/ride/request-send
router.post("/ride/request-send", (0, middleware_1.validateSchema)(rideRequestValidators_1.sendRideRequestSchema), errorHandler_1.handleValidationErrors, (req, res) => rideRequestController.sendRideRequest(req, res));
// POST /api/user/ride/auto-request-send
router.post("/ride/auto-request-send", (0, middleware_1.validateSchema)(autoSearchAndRequestValidators_1.autoSearchAndRequestSchema), errorHandler_1.handleValidationErrors, (req, res) => autoRideController.autoSearchAndSendRequests(req, res));
// POST /api/user/ride/request-cancel
router.post("/ride/request-cancel", (req, res) => autoRideController.cancelRideRequests(req, res));
// POST /api/user/ride/future-schedule
router.post("/ride/future-schedule", (0, middleware_1.validateSchema)(scheduleFutureRideValidators_1.scheduleFutureRideSchema), errorHandler_1.handleValidationErrors, (req, res) => autoRideController.scheduleFutureRide(req, res));
// POST /api/user/ride/future-cancel
router.post("/ride/future-cancel", (0, middleware_1.validateSchema)(scheduleFutureRideValidators_1.cancelFutureRideSchema), errorHandler_1.handleValidationErrors, (req, res) => autoRideController.cancelFutureRide(req, res));
// GET /api/user/ride/rides
router.get("/ride/rides", (0, middleware_1.validateSchema)(getUserRidesSchema_1.getUserRidesSchema), errorHandler_1.handleValidationErrors, (req, res) => rideController.getUserRides(req, res));
// GET /api/user/ride/:rideId - Get specific ride details
router.get("/ride/:rideId", (0, middleware_1.validateSchema)(rideIdParamSchema_1.rideIdParamSchema), (req, res) => rideController.getUserRideById(req, res));
// POST /api/user/ride/:rideId/cancel - Rider cancels a ride
router.post("/ride/:rideId/cancel", (0, middleware_1.validateSchema)(cancelRideSchema_1.cancelRideSchema), errorHandler_1.handleValidationErrors, (req, res) => rideController.cancelRide(req, res));
// POST /api/user/ride/:rideId/rating - Rider rates a completed ride
router.post("/ride/:rideId/rating", (0, middleware_1.validateSchema)(rateRideSchema_1.rateRideSchema), errorHandler_1.handleValidationErrors, (req, res) => rideController.rateDriver(req, res));
// POST /api/user/ride/:rideId/coupon - Apply coupon on ride
router.post("/ride/:rideId/coupon", (0, middleware_1.validateSchema)(couponSchema_1.applyCouponSchema), errorHandler_1.handleValidationErrors, (req, res) => couponController.applyCoupon(req, res));
// DELETE /api/user/ride/:rideId/coupon - Remove applied coupon
router.delete("/ride/:rideId/coupon", (0, middleware_1.validateSchema)(couponSchema_1.removeCouponSchema), errorHandler_1.handleValidationErrors, (req, res) => couponController.removeCoupon(req, res));
//# sourceMappingURL=rideRoutes.js.map