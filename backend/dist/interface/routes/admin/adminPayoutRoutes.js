"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPayoutRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const DITypes_1 = require("../../../shared/constants/DITypes");
const ValidationMiddleware_1 = require("../../middleware/ValidationMiddleware");
const payoutValidators_1 = require("../../validators/payment/payoutValidators");
const router = (0, express_1.Router)();
exports.adminPayoutRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.AdminPayoutController);
// GET /api/admin/payouts
router.get("/", (0, ValidationMiddleware_1.validateSchema)(payoutValidators_1.getAdminPayoutsSchema), (req, res) => controller.getPayouts(req, res));
// PATCH /api/admin/payouts/:payoutId/approve
router.patch("/:payoutId/approve", (0, ValidationMiddleware_1.validateSchema)(payoutValidators_1.approvePayoutSchema), (req, res) => controller.approvePayout(req, res));
// PATCH /api/admin/payouts/:payoutId/reject
router.patch("/:payoutId/reject", (0, ValidationMiddleware_1.validateSchema)(payoutValidators_1.rejectPayoutSchema), (req, res) => controller.rejectPayout(req, res));
//# sourceMappingURL=adminPayoutRoutes.js.map