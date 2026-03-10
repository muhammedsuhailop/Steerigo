import { Router } from "express";
import { adminUserRoutes } from "./adminUserRoutes";
import { adminDriverRoutes } from "./adminDriverRoutes";
import { adminRideRoutes } from "./adminRideRoutes";

const router = Router();

router.use("/users", adminUserRoutes);
router.use("/drivers", adminDriverRoutes);
router.use("/rides", adminRideRoutes);

export { router as adminRoutes };
