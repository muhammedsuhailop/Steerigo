import { Router } from "express";
import { adminUserRoutes } from "./adminUserRoutes";

const router = Router();

router.use("/users", adminUserRoutes);

export { router as adminRoutes };
