import { Router } from "express";
import { userProfileRoutes } from "./userProfileRoutes";

const router = Router();

router.use("/profile", userProfileRoutes);

export { router as userRoutes };
