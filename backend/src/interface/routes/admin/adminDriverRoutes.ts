import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { AdminDriverController } from "@interface/controllers/admin/AdminDriverController";
import {
  validateGetDriversRequest,
  validateDriverActionRequest,
  validateGetDriverProfileRequest,
  validateGetKycRequestsRequest,
  validateUpdateKycStatusRequest,
  validateGetKycRequestByIdRequest,
  validateUpdateDriverKycStatusRequest,
} from "@interface/validators/admin/adminDriverValidators";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();

// Get admin driver controller instance from container
const adminDriverController = container.get<AdminDriverController>(
  TYPES.AdminDriverController,
);

// GET /api/admin/drivers
router.get("/", validateGetDriversRequest, (req, res) =>
  adminDriverController.getDrivers(req, res),
);

// PUT /api/admin/drivers/:driverId/action
router.put("/:driverId/action", validateDriverActionRequest, (req, res) =>
  adminDriverController.driverAction(req, res),
);

// GET /api/admin/drivers/:driverId/profile
router.get("/:driverId/profile", validateGetDriverProfileRequest, (req, res) =>
  adminDriverController.getDriverProfile(req, res),
);

// GET /api/admin/drivers/kyc-requests
router.get("/kyc-requests", validateGetKycRequestsRequest, (req, res) =>
  adminDriverController.getKycRequests(req, res),
);

// PATCH /api/admin/drivers/kyc-requests/:kycId/status
router.patch(
  "/kyc-requests/:kycId/status",
  validateUpdateKycStatusRequest,
  (req, res) => adminDriverController.updateKycStatus(req, res),
);

// GET /api/admin/drivers/kyc-requests/:kycId
router.get(
  "/kyc-requests/:kycId",
  validateGetKycRequestByIdRequest,
  (req, res) => adminDriverController.getKycRequestById(req, res),
);

// PATCH /api/admin/drivers/:driverId/kyc-status/update
router.patch(
  "/:driverId/kyc-status/update",
  validateUpdateDriverKycStatusRequest,
  (req, res) => adminDriverController.updateDriverKycStatus(req, res),
);

export { router as adminDriverRoutes };
