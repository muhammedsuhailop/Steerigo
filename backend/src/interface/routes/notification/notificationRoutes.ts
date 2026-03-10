import { Router } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { NotificationController } from "@interface/controllers/notification/NotificationController";
import { authMiddleware, validateSchema } from "@interface/middleware";
import { getNotificationsSchema } from "@interface/validators/notification/getNotificationsSchema";
import { markNotificationsReadSchema } from "@interface/validators/notification/markNotificationsReadSchema";
import { TYPES } from "@shared/constants/DITypes";

const notificationRoutes = Router();

const notificationController = container.get<NotificationController>(
  TYPES.NotificationController,
);

notificationRoutes.use(authMiddleware);

// GET  /api/notifications - Get notifications with pagination and filters
notificationRoutes.get(
  "/",
  validateSchema(getNotificationsSchema),
  (req, res) => notificationController.getNotifications(req, res),
);

// PATCH /api/notifications/read - Mark one or all notifications as read
notificationRoutes.patch(
  "/read",
  validateSchema(markNotificationsReadSchema),
  (req, res) => notificationController.markAsRead(req, res),
);

export { notificationRoutes };
