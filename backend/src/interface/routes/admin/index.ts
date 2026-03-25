import { Router } from "express";
import { adminUserRoutes } from "./adminUserRoutes";
import { adminDriverRoutes } from "./adminDriverRoutes";
import { adminRideRoutes } from "./adminRideRoutes";
import { adminPayoutRoutes } from "./adminPayoutRoutes";

const router = Router();

router.use("/users", adminUserRoutes);
router.use("/drivers", adminDriverRoutes);
router.use("/rides", adminRideRoutes);
router.use("/payouts", adminPayoutRoutes);

export { router as adminRoutes };
