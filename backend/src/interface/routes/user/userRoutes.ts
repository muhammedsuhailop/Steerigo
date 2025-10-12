import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { UserProfileController } from "@interface/controllers/user/UserProfileController";
import { authMiddleware } from "@interface/middleware/auth/AuthMiddleware";
import { TYPES } from "@shared/constants/DITypes";
import { getUserProfileValidation } from "@interface/validators";

const router = Router();
const userProfileController = container.get<UserProfileController>(
  TYPES.UserProfileController
);

router.use(authMiddleware);

// GET /api/user/profile/:userId
router.get("/profile/:userId", (req: Request, res: Response) =>
  userProfileController.getProfile(req, res)
);

// PUT /api/user/profile/:userId
router.put("/profile/:userId", (req: Request, res: Response) =>
  userProfileController.updateProfile(req, res)
);

// POST /api/user/profile/:userId/register-as-driver
router.post(
  "/:userId/register-as-driver",
  getUserProfileValidation,
  (req: Request, res: Response) =>
    userProfileController.registerAsDriver(req, res)
);

export { router as userRoutes };
