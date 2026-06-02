"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRideRoutes = void 0;
const express_1 = require("express");
const container_1 = require("@infrastructure/container");
const middleware_1 = require("@interface/middleware");
const errorHandler_1 = require("@interface/middleware/errorHandler");
const DITypes_1 = require("@shared/constants/DITypes");
const GetAdminRidesDto_1 = require("@application/dto/admin/GetAdminRidesDto");
const GetAdminRatingsDto_1 = require("@application/dto/admin/GetAdminRatingsDto");
const adminRideValidators_1 = require("@interface/validators/admin/adminRideValidators");
const router = (0, express_1.Router)();
exports.adminRideRoutes = router;
const adminRideController = container_1.container.get(DITypes_1.TYPES.AdminRideController);
// GET /admin/rides
router.get("/", (0, middleware_1.validateSchema)(GetAdminRidesDto_1.getAdminRidesSchema), errorHandler_1.handleValidationErrors, (req, res) => adminRideController.getRides(req, res));
// GET /admin/rides/ratings
router.get("/ratings", (0, middleware_1.validateSchema)(GetAdminRatingsDto_1.getAdminRatingsSchema), errorHandler_1.handleValidationErrors, (req, res) => adminRideController.getRatings(req, res));
// GET /admin/rides/:rideId
router.get("/:rideId", (0, middleware_1.validateSchema)(adminRideValidators_1.getAdminRideByIdSchema), errorHandler_1.handleValidationErrors, (req, res) => adminRideController.getRideById(req, res));
//# sourceMappingURL=adminRideRoutes.js.map