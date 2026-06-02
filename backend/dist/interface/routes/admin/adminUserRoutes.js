"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserRoutes = void 0;
const express_1 = require("express");
const container_1 = require("../../../infrastructure/container");
const AdminUserValidator_1 = require("../../validators/admin/AdminUserValidator");
const DITypes_1 = require("../../../shared/constants/DITypes");
const adminUserProfileValidator_1 = require("../../validators/admin/adminUserProfileValidator");
const router = (0, express_1.Router)();
exports.adminUserRoutes = router;
// Get admin user controller instance from container
const adminUserController = container_1.container.get(DITypes_1.TYPES.AdminUserController);
// GET /admin/users - Get all users with filters and pagination
router.get("/", AdminUserValidator_1.validateGetUsersRequest, (req, res) => adminUserController.getUsers(req, res));
// GET /admin/users/:userId/profile
router.get("/:userId/profile", adminUserProfileValidator_1.validateGetUserProfileRequest, (req, res) => adminUserController.getUserProfile(req, res));
// PUT /admin/users/:userId/action - Update user status
router.put("/:userId/action", AdminUserValidator_1.validateUpdateUserStatusRequest, (req, res) => adminUserController.updateUserStatus(req, res));
//# sourceMappingURL=adminUserRoutes.js.map