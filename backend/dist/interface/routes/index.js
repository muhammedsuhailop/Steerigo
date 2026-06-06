"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const AuthRoutes_1 = require("./auth/AuthRoutes");
const driverRoutes_1 = require("./driver/driverRoutes");
const admin_1 = require("./admin");
const fileRoutes_1 = require("./file/fileRoutes");
const userRoutes_1 = require("./user/userRoutes");
const notificationRoutes_1 = require("./notification/notificationRoutes");
const paymentRoutes_1 = require("./payment/paymentRoutes");
const chatRoutes_1 = require("./chat/chatRoutes");
const router = (0, express_1.Router)();
exports.apiRoutes = router;
router.use("/auth", AuthRoutes_1.authRoutes);
router.use("/driver", driverRoutes_1.driverRoutes);
router.use("/admin", admin_1.adminRoutes);
router.use("/user", userRoutes_1.userRoutes);
router.use("/file", fileRoutes_1.fileRoutes);
router.use("/notifications", notificationRoutes_1.notificationRoutes);
router.use("/payment", paymentRoutes_1.paymentRoutes);
router.use("/chat-room", chatRoutes_1.chatRoomRoutes);
// Test Server endpoint
router.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is stable",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});
//# sourceMappingURL=index.js.map