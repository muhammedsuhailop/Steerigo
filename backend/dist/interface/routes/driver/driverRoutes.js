"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const AuthMiddleware_1 = require("@interface/middleware/auth/AuthMiddleware");
const driverValidationSchemas_1 = require("@interface/validators/driver/driverValidationSchemas");
const DITypes_1 = require("@shared/constants/DITypes");
const DriverAvailabilityRoutes_1 = require("./DriverAvailabilityRoutes");
const DriverRideRoutes_1 = require("./DriverRideRoutes");
const driverPayoutRoutes_1 = require("./driverPayoutRoutes");
const driverStatsRoutes_1 = require("./driverStatsRoutes");
const router = (0, express_1.Router)();
exports.driverRoutes = router;
// Get controller instance from DI container
const driverController = DIContainer_1.container.get(DITypes_1.TYPES.DriverController);
const walletController = DIContainer_1.container.get(DITypes_1.TYPES.DriverWalletController);
router.use((req, res, next) => {
    console.log("Request body:", req.body);
    next();
});
// Apply authentication and DRIVER role authorization to all driver routes
router.use(AuthMiddleware_1.authMiddleware);
router.use((0, AuthMiddleware_1.requireRole)(["Driver"]));
// GET /api/driver/dashboard
router.get("/dashboard", (req, res) => driverController.getDashboard(req, res));
// GET /api/driver/status
router.get("/status", (req, res) => driverController.getStatus(req, res));
// POST /api/driver/register - Register as driver
router.post("/register", (0, ValidationMiddleware_1.validateSchema)(driverValidationSchemas_1.driverRegistrationSchema), (req, res) => driverController.register(req, res));
// GET /api/driver/profile - Get driver profile
router.get("/profile", (req, res) => driverController.getDetailedProfile(req, res));
// PUT /api/driver/profile - Update driver profile
router.put("/profile", (0, ValidationMiddleware_1.validateSchema)(driverValidationSchemas_1.driverUpdateSchema), (req, res) => driverController.updateProfile(req, res));
// POST /api/driver/kyc - Submit KYC document
router.put("/kyc", (0, ValidationMiddleware_1.validateSchema)(driverValidationSchemas_1.kycSubmissionSchema), (req, res) => driverController.submitKYC(req, res));
// GET /api/driver/kyc - Get KYC status
router.get("/kyc", (req, res) => driverController.getKYCStatus(req, res));
// GET /api/driver/wallet
router.get("/wallet", (req, res) => walletController.getWallet(req, res));
// /api/driver/availability
router.use("/availability", DriverAvailabilityRoutes_1.driverAvailabilityRoutes);
// /api/driver/ride
router.use("/ride", DriverRideRoutes_1.driverRideRoutes);
// /api/driver/payouts
router.use("/payouts", driverPayoutRoutes_1.driverPayoutRoutes);
// /api/driver/stats
router.use("/stats", driverStatsRoutes_1.driverStatsRoutes);
//# sourceMappingURL=driverRoutes.js.map