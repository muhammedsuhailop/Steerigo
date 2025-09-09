import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/Container";
import { AdminUserController } from "../../controllers/admin/AdminUserController";
import {
  getUsersValidation,
  updateUserStatusValidation,
} from "../../validators/admin/adminValidators";
import { authMiddleware } from "../../middleware/auth/AuthMiddleware";
import { requireRoles } from "../../middleware/auth/RoleMiddleware";

const router = Router();
const adminUserController =
  container.get<AdminUserController>(AdminUserController);

//authentication middleware
router.use(authMiddleware);
router.use(requireRoles("Admin"));

// GET /api/admin/users - Get users with filtering and pagination
router.get("/", getUsersValidation, (req: Request, res: Response) =>
  adminUserController.getUsers(req, res)
);

// PUT /api/admin/users/:userId/action - Update user status
router.put(
  "/:userId/action",
  updateUserStatusValidation,
  (req: Request, res: Response) =>
    adminUserController.updateUserStatus(req, res)
);

export { router as adminUserRoutes };
