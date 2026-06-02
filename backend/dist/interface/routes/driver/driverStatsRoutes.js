"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverStatsRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const DITypes_1 = require("../../../shared/constants/DITypes");
const router = (0, express_1.Router)();
exports.driverStatsRoutes = router;
const controller = DIContainer_1.container.get(DITypes_1.TYPES.DriverStatsController);
// GET /api/driver/stats
router.get("/", (req, res) => controller.getMyStats(req, res));
//# sourceMappingURL=driverStatsRoutes.js.map