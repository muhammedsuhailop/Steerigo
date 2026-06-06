"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDriverRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const adminDriverValidators_1 = require("../../validators/admin/adminDriverValidators");
const DITypes_1 = require("../../../shared/constants/DITypes");
const router = (0, express_1.Router)();
exports.adminDriverRoutes = router;
// Get admin driver controller instance from container
const adminDriverController = DIContainer_1.container.get(DITypes_1.TYPES.AdminDriverController);
// GET /api/admin/drivers
router.get("/", adminDriverValidators_1.validateGetDriversRequest, (req, res) => adminDriverController.getDrivers(req, res));
// PUT /api/admin/drivers/:driverId/action
router.put("/:driverId/action", adminDriverValidators_1.validateDriverActionRequest, (req, res) => adminDriverController.driverAction(req, res));
// GET /api/admin/drivers/:driverId/profile
router.get("/:driverId/profile", adminDriverValidators_1.validateGetDriverProfileRequest, (req, res) => adminDriverController.getDriverProfile(req, res));
// GET /api/admin/drivers/kyc-requests
router.get("/kyc-requests", adminDriverValidators_1.validateGetKycRequestsRequest, (req, res) => adminDriverController.getKycRequests(req, res));
// PATCH /api/admin/drivers/kyc-requests/:kycId/status
router.patch("/kyc-requests/:kycId/status", adminDriverValidators_1.validateUpdateKycStatusRequest, (req, res) => adminDriverController.updateKycStatus(req, res));
// GET /api/admin/drivers/kyc-requests/:kycId
router.get("/kyc-requests/:kycId", adminDriverValidators_1.validateGetKycRequestByIdRequest, (req, res) => adminDriverController.getKycRequestById(req, res));
// PATCH /api/admin/drivers/:driverId/kyc-status/update
router.patch("/:driverId/kyc-status/update", adminDriverValidators_1.validateUpdateDriverKycStatusRequest, (req, res) => adminDriverController.updateDriverKycStatus(req, res));
//# sourceMappingURL=adminDriverRoutes.js.map