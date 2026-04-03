import { Router } from "express";
import { adminUserRoutes } from "./adminUserRoutes";
import { adminDriverRoutes } from "./adminDriverRoutes";
import { adminRideRoutes } from "./adminRideRoutes";
import { adminPayoutRoutes } from "./adminPayoutRoutes";
import { adminCouponRoutes } from "./adminCouponRoutes";
import { adminTransactionRoutes } from "./adminTransactionRoutes";
import { adminWalletRoutes } from "./adminWalletRoutes";

const router = Router();

router.use("/users", adminUserRoutes);
router.use("/drivers", adminDriverRoutes);
router.use("/rides", adminRideRoutes);
router.use("/payouts", adminPayoutRoutes);
router.use("/coupons", adminCouponRoutes);
router.use("/transactions", adminTransactionRoutes);
router.use("/wallet", adminWalletRoutes);

export { router as adminRoutes };
