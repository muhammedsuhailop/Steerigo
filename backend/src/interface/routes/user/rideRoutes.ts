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
import { cancelRideSchema } from "@interface/validators/user/cancelRideSchema";
import { rateRideSchema } from "@interface/validators/user/rateRideSchema";
import {
  applyCouponSchema,
  removeCouponSchema,
} from "@interface/validators/user/couponSchema";
import { CouponController } from "@interface/controllers/user/CouponController";
import {
  cancelFutureRideSchema,
  scheduleFutureRideSchema,
} from "@interface/validators/user/scheduleFutureRideValidators";

const router = Router();

const rideRequestController = container.get<RideController>(
  TYPES.RideController,
);

const autoRideController = container.get<AutoRideController>(
  TYPES.AutoRideController,
);

const rideController = container.get<RideController>(TYPES.RideController);

const couponController = container.get<CouponController>(
  TYPES.CouponController,
);

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

// POST /api/user/ride/future-schedule
router.post(
  "/ride/future-schedule",
  validateSchema(scheduleFutureRideSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    autoRideController.scheduleFutureRide(req, res),
);

// POST /api/user/ride/future-cancel
router.post(
  "/ride/future-cancel",
  validateSchema(cancelFutureRideSchema),
  handleValidationErrors,
  (req: Request, res: Response) =>
    autoRideController.cancelFutureRide(req, res),
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

// POST /api/user/ride/:rideId/cancel - Rider cancels a ride
router.post(
  "/ride/:rideId/cancel",
  validateSchema(cancelRideSchema),
  handleValidationErrors,
  (req: Request, res: Response) => rideController.cancelRide(req, res),
);

// POST /api/user/ride/:rideId/rating - Rider rates a completed ride
router.post(
  "/ride/:rideId/rating",
  validateSchema(rateRideSchema),
  handleValidationErrors,
  (req: Request, res: Response) => rideController.rateDriver(req, res),
);

// POST /api/user/ride/:rideId/coupon - Apply coupon on ride
router.post(
  "/ride/:rideId/coupon",
  validateSchema(applyCouponSchema),
  handleValidationErrors,
  (req: Request, res: Response) => couponController.applyCoupon(req, res),
);

// DELETE /api/user/ride/:rideId/coupon - Remove applied coupon
router.delete(
  "/ride/:rideId/coupon",
  validateSchema(removeCouponSchema),
  handleValidationErrors,
  (req: Request, res: Response) => couponController.removeCoupon(req, res),
);

export { router as rideRoutes };
