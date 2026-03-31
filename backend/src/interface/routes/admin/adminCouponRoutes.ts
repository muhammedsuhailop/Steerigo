import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { AdminCouponController } from "@interface/controllers/admin/AdminCouponController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import {
  authMiddleware,
  requireRole,
} from "@interface/middleware/auth/AuthMiddleware";
import { UserRole } from "@shared/constants/AuthConstants";
import {
  createCouponSchema,
  editCouponSchema,
  getAdminCouponsSchema,
} from "@interface/validators/admin/couponValidators";

const router = Router();
const controller = container.get<AdminCouponController>(
  TYPES.AdminCouponController,
);

router.use(authMiddleware);
router.use(requireRole([UserRole.ADMIN]));

// GET /api/admin/coupons
router.get("/", validateSchema(getAdminCouponsSchema), (req, res) =>
  controller.getCoupons(req, res),
);

// POST /api/admin/coupons/add
router.post("/add", validateSchema(createCouponSchema), (req, res) =>
  controller.createCoupon(req, res),
);

// PATCH /api/admin/coupons/:couponId
router.patch("/:couponId", validateSchema(editCouponSchema), (req, res) =>
  controller.editCoupon(req, res),
);

export { router as adminCouponRoutes };
