"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCouponRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const ValidationMiddleware_1 = require("@interface/middleware/ValidationMiddleware");
const couponValidators_1 = require("@interface/validators/admin/couponValidators");
const router = (0, express_1.Router)();
exports.adminCouponRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.AdminCouponController);
// GET /api/admin/coupons
router.get("/", (0, ValidationMiddleware_1.validateSchema)(couponValidators_1.getAdminCouponsSchema), (req, res) => controller.getCoupons(req, res));
// POST /api/admin/coupons/add
router.post("/add", (0, ValidationMiddleware_1.validateSchema)(couponValidators_1.createCouponSchema), (req, res) => controller.createCoupon(req, res));
// PATCH /api/admin/coupons/:couponId
router.patch("/:couponId", (0, ValidationMiddleware_1.validateSchema)(couponValidators_1.editCouponSchema), (req, res) => controller.editCoupon(req, res));
//# sourceMappingURL=adminCouponRoutes.js.map