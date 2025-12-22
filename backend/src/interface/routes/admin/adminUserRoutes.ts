import { Router } from "express";
import { container } from "@infrastructure/container";
import { AdminUserController } from "@interface/controllers/admin/AdminUserController";
import {
  validateGetUsersRequest,
  validateUpdateUserStatusRequest,
} from "@interface/validators/admin/AdminUserValidator";
import { authMiddleware } from "@interface/middleware/auth/AuthMiddleware";
import { requireRole } from "@interface/middleware/auth/AuthMiddleware";
import { TYPES } from "@shared/constants/DITypes";
import { validateGetUserProfileRequest } from "@interface/validators/admin/adminUserProfileValidator";

const router = Router();

// Get admin user controller instance from container
const adminUserController = container.get<AdminUserController>(
  TYPES.AdminUserController
);

// Apply authentication and admin role authorization to all routes
router.use(authMiddleware);
router.use(requireRole(["Admin"]));

// GET /admin/users - Get all users with filters and pagination
router.get("/", validateGetUsersRequest, (req, res) =>
  adminUserController.getUsers(req, res)
);

// GET /admin/users/:userId/profile
router.get("/:userId/profile", validateGetUserProfileRequest, (req, res) =>
  adminUserController.getUserProfile(req, res)
);

// PUT /admin/users/:userId/action - Update user status
router.put("/:userId/action", validateUpdateUserStatusRequest, (req, res) =>
  adminUserController.updateUserStatus(req, res)
);

export { router as adminUserRoutes };
