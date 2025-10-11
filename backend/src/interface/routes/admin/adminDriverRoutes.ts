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
} from "@interface/validators/admin/adminDriverValidators";
import { authMiddleware } from "@interface/middleware/auth/AuthMiddleware";
import { requireRole } from "@interface/middleware/auth/AuthMiddleware";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();

// Get admin driver controller instance from container
const adminDriverController = container.get<AdminDriverController>(
  TYPES.AdminDriverController
);

// authentication and admin role authorization to all routes
router.use(authMiddleware);
router.use(requireRole(["Admin"]));

// GET /admin/drivers
router.get("/", validateGetDriversRequest, (req, res) =>
  adminDriverController.getDrivers(req, res)
);

// PUT /admin/drivers/:driverId/action
router.put("/:driverId/action", validateDriverActionRequest, (req, res) =>
  adminDriverController.driverAction(req, res)
);

// GET /admin/drivers/:driverId/profile
router.get("/:driverId/profile", validateGetDriverProfileRequest, (req, res) =>
  adminDriverController.getDriverProfile(req, res)
);

// GET /admin/drivers/kyc-requests
router.get("/kyc-requests", validateGetKycRequestsRequest, (req, res) =>
  adminDriverController.getKycRequests(req, res)
);

// PATCH /admin/drivers/kyc-requests/:kycId/status
router.patch(
  "/kyc-requests/:kycId/status",
  validateUpdateKycStatusRequest,
  (req, res) => adminDriverController.updateKycStatus(req, res)
);

// GET /admin/drivers/kyc-requests/:kycId
router.get(
  "/kyc-requests/:kycId",
  validateGetKycRequestByIdRequest,
  (req, res) => adminDriverController.getKycRequestById(req, res)
);

export { router as adminDriverRoutes };
