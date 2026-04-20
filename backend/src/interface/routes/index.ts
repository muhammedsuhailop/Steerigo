import { Router } from "express";
import { authRoutes } from "./auth/AuthRoutes";
import { driverRoutes } from "./driver/driverRoutes";
import { adminRoutes } from "./admin";
import { fileRoutes } from "./file/fileRoutes";
import { userRoutes } from "./user/userRoutes";
import { notificationRoutes } from "./notification/notificationRoutes";
import { paymentRoutes } from "./payment/paymentRoutes";
import { chatRoomRoutes } from "./chat/chatRoutes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/driver", driverRoutes);

router.use("/admin", adminRoutes);

router.use("/user", userRoutes);

router.use("/file", fileRoutes);

router.use("/notifications", notificationRoutes);

router.use("/payment", paymentRoutes);

router.use("/chat-room", chatRoomRoutes);

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
