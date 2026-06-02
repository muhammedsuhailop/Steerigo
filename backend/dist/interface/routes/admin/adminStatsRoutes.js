"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStatsRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
const router = (0, express_1.Router)();
exports.adminStatsRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.AdminStatsController);
// GET /api/admin/stats/users
router.get("/users", (req, res) => controller.getUserStats(req, res));
// GET /api/admin/stats/rides;
router.get("/rides", (req, res) => controller.getRideStats(req, res));
// GET /api/admin/stats/drivers
router.get("/drivers", (req, res) => controller.getDriverStats(req, res));
//# sourceMappingURL=adminStatsRoutes.js.map