import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { driverRoutes } from "./driver/driverRoutes";
import { adminRoutes } from "./admin";

const router = Router();

router.use("/auth", authRoutes);

router.use("/driver", driverRoutes);

router.use("/admin", adminRoutes);

// Test Server endpoint
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is stable",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

export { router as apiRoutes };
