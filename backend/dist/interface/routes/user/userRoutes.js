"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const AuthMiddleware_1 = require("../../middleware/auth/AuthMiddleware");
const DITypes_1 = require("../../../shared/constants/DITypes");
const validators_1 = require("../../validators");
const errorHandler_1 = require("../../middleware/errorHandler");
const middleware_1 = require("../../middleware");
const driverSearchValidators_1 = require("../../validators/user/driverSearchValidators");
const rideRoutes_1 = require("./rideRoutes");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const router = (0, express_1.Router)();
exports.userRoutes = router;
const userProfileController = DIContainer_1.container.get(DITypes_1.TYPES.UserProfileController);
const driverSearchController = DIContainer_1.container.get(DITypes_1.TYPES.DriverSearchController);
const couponController = DIContainer_1.container.get(DITypes_1.TYPES.CouponController);
router.use(AuthMiddleware_1.authMiddleware);
router.use((0, AuthMiddleware_1.requireRole)([AuthConstants_1.UserRole.RIDER]));
router.use(rideRoutes_1.rideRoutes);
// GET /api/user/profile
router.get("/profile", (req, res) => userProfileController.getProfile(req, res));
// PUT /api/user/profile
router.put("/profile", (req, res) => userProfileController.updateProfile(req, res));
// POST /api/user/profile/register-as-driver
router.post("/register-as-driver", validators_1.getUserProfileValidation, (req, res) => userProfileController.registerAsDriver(req, res));
// GET /api/user/coupons
router.get("/coupons", (req, res) => couponController.getUserCoupons(req, res));
// GET /api/user/stats
router.get("/stats", (req, res) => userProfileController.getMyStats(req, res));
// POST /api/drivers/search/nearby
router.post("/search/nearby", (0, middleware_1.validateSchema)(driverSearchValidators_1.findNearbyDriversSearchSchema), errorHandler_1.handleValidationErrors, (req, res) => driverSearchController.findNearbyDrivers(req, res));
//# sourceMappingURL=userRoutes.js.map