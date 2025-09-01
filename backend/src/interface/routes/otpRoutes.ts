import { Router } from "express";
import { sendOtp } from "../controllers/otpController.ts";
const router = Router();
router.post('/send-otp',sendOtp);
export default router;