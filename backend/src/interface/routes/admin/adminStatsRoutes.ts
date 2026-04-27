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

export { router as adminStatsRoutes };
