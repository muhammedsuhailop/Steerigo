import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { DriverStatsController } from "@interface/controllers/driver/DriverStatsController";

const router = Router();
const controller = container.get<DriverStatsController>(
  TYPES.DriverStatsController,
);

// GET /api/driver/stats
router.get("/", (req, res) => controller.getMyStats(req, res));

export { router as driverStatsRoutes };
