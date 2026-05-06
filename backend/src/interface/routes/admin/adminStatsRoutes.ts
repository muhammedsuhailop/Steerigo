import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { AdminStatsController } from "@interface/controllers/admin/AdminStatsController";

const router = Router();

const controller = container.get<AdminStatsController>(
  TYPES.AdminStatsController,
);

// GET /api/admin/stats/users
router.get("/users", (req, res) => controller.getUserStats(req, res));

// GET /api/admin/stats/rides;
router.get("/rides", (req, res) => controller.getRideStats(req, res));

// GET /api/admin/stats/drivers
router.get("/drivers", (req, res) => controller.getDriverStats(req, res));

export { router as adminStatsRoutes };
