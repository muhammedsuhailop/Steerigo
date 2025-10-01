import { Router } from "express";
import { adminUserRoutes } from "./adminUserRoutes";
import { adminDriverRoutes } from "./adminDriverRoutes";

const router = Router();

router.use("/users", adminUserRoutes);
router.use("/", adminDriverRoutes);

export { router as adminRoutes };
