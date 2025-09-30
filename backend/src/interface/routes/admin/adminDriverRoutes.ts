import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/Container";
import { AdminDriverController } from "../../controllers/admin/AdminDriverController";
import {
  getDriversValidation,
  driverActionValidation,
  getKycRequestsValidation,
  getDriverProfileValidation,
  updateKycStatusValidation,
} from "../../validators/admin/adminDriverValidators";
import { authMiddleware } from "../../middleware/auth/AuthMiddleware";
import { requireRoles } from "../../middleware/auth/RoleMiddleware";

const router = Router();
const adminDriverController = container.get<AdminDriverController>(
  AdminDriverController
);

router.use(authMiddleware);
router.use(requireRoles("Admin"));

// GET /api/admin/drivers
router.get("/drivers", getDriversValidation, (req: Request, res: Response) =>
  adminDriverController.getDrivers(req, res)
);

/*
// PUT /api/admin/driver/:driverId/action 
router.put("/:driverId/action", driverActionValidation, (req: Request, res: Response) =>
  adminDriverController.driverAction(req, res)
);

// GET /api/admin/kyc-requests 
router.get("/kyc-requests", getKycRequestsValidation, (req: Request, res: Response) =>
  adminDriverController.getKycRequests(req, res)
);

// GET /api/admin/drivers/:driverId/profile 
router.get("/:driverId/profile", getDriverProfileValidation, (req: Request, res: Response) =>
  adminDriverController.getDriverProfile(req, res)
);

// PUT /api/admin/drivers/:driverId/kyc-status 
router.put("/:driverId/kyc-status", updateKycStatusValidation, (req: Request, res: Response) =>
  adminDriverController.updateKycStatus(req, res)
);
*/

export { router as adminDriverRoutes };
