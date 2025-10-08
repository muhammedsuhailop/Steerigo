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
import { authMiddleware } from "@interface/middleware/auth/authMiddleware";
import { requireRole } from "@interface/middleware/auth/authMiddleware";
import { TYPES } from "@shared/constants/DITypes";

const router = Router();

// Get admin driver controller instance from container
const adminDriverController = container.get<AdminDriverController>(
  TYPES.AdminDriverController
);

// Apply authentication and admin role authorization to all routes
router.use(authMiddleware);
router.use(requireRole(["Admin"]));

// GET /admin/drivers - Get all drivers with filters and pagination
router.get("/", validateGetDriversRequest, (req, res) =>
  adminDriverController.getDrivers(req, res)
);

// PUT /admin/drivers/:driverId/action - Perform driver action
router.put("/:driverId/action", validateDriverActionRequest, (req, res) =>
  adminDriverController.driverAction(req, res)
);

// GET /admin/drivers/:driverId/profile - Get driver profile
router.get("/:driverId/profile", validateGetDriverProfileRequest, (req, res) =>
  adminDriverController.getDriverProfile(req, res)
);

// GET /admin/drivers/kyc-requests - Get KYC requests
router.get("/kyc-requests", validateGetKycRequestsRequest, (req, res) =>
  adminDriverController.getKycRequests(req, res)
);

// PATCH /admin/drivers/kyc-requests/:kycId/status - Update KYC status
router.patch(
  "/kyc-requests/:kycId/status",
  validateUpdateKycStatusRequest,
  (req, res) => adminDriverController.updateKycStatus(req, res)
);

// GET /admin/drivers/kyc-requests/:kycId - Get KYC request by ID
router.get(
  "/kyc-requests/:kycId",
  validateGetKycRequestByIdRequest,
  (req, res) => adminDriverController.getKycRequestById(req, res)
);

export { router as adminDriverRoutes };
