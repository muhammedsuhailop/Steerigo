import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import {
  driverRegistrationSchema,
  driverUpdateSchema,
  kycSubmissionSchema,
} from "@interface/validators/driver/driverValidationSchemas";
import { DriverController } from "@interface/controllers/driver/DriverController";
import { TYPES } from "@shared/constants/DITypes";
import { driverAvailabilityRoutes } from "./DriverAvailabilityRoutes";
import { driverRideRoutes } from "./DriverRideRoutes";
import { driverPayoutRoutes } from "./driverPayoutRoutes";
import { DriverWalletController } from "@interface/controllers/driver/DriverWalletController";

const router = Router();

// Get controller instance from DI container
const driverController = container.get<DriverController>(
  TYPES.DriverController,
);

const walletController = container.get<DriverWalletController>(
  TYPES.DriverWalletController,
);

router.use((req, res, next) => {
  console.log("Request body:", req.body);
  next();
});

// Apply authentication and DRIVER role authorization to all driver routes
router.use(authMiddleware);
router.use(requireRole(["Driver"]));

// GET /api/driver/dashboard
router.get("/dashboard", (req, res) => driverController.getDashboard(req, res));

// GET /api/driver/status
router.get("/status", (req, res) => driverController.getStatus(req, res));

// POST /api/driver/register - Register as driver
router.post("/register", validateSchema(driverRegistrationSchema), (req, res) =>
  driverController.register(req, res),
);

// GET /api/driver/profile - Get driver profile
router.get("/profile", (req, res) =>
  driverController.getDetailedProfile(req, res),
);

// PUT /api/driver/profile - Update driver profile
router.put("/profile", validateSchema(driverUpdateSchema), (req, res) =>
  driverController.updateProfile(req, res),
);

// POST /api/driver/kyc - Submit KYC document
router.put("/kyc", validateSchema(kycSubmissionSchema), (req, res) =>
  driverController.submitKYC(req, res),
);

// GET /api/driver/kyc - Get KYC status
router.get("/kyc", (req, res) => driverController.getKYCStatus(req, res));

// GET /api/driver/wallet
router.get("/wallet", (req, res) => walletController.getWallet(req, res));

// /api/driver/availability
router.use("/availability", driverAvailabilityRoutes);

// /api/driver/ride
router.use("/ride", driverRideRoutes);

// /api/driver/payouts
router.use("/payouts", driverPayoutRoutes);

export { router as driverRoutes };
