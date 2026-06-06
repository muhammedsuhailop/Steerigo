"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../../../infrastructure/container/DIContainer");
const middleware_1 = require("../../middleware");
const getNotificationsSchema_1 = require("../../validators/notification/getNotificationsSchema");
const markNotificationsReadSchema_1 = require("../../validators/notification/markNotificationsReadSchema");
const DITypes_1 = require("../../../shared/constants/DITypes");
const notificationRoutes = (0, express_1.Router)();
exports.notificationRoutes = notificationRoutes;
const notificationController = DIContainer_1.container.get(DITypes_1.TYPES.NotificationController);
notificationRoutes.use(middleware_1.authMiddleware);
// GET  /api/notifications - Get notifications with pagination and filters
notificationRoutes.get("/", (0, middleware_1.validateSchema)(getNotificationsSchema_1.getNotificationsSchema), (req, res) => notificationController.getNotifications(req, res));
// PATCH /api/notifications/read - Mark one or all notifications as read
notificationRoutes.patch("/read", (0, middleware_1.validateSchema)(markNotificationsReadSchema_1.markNotificationsReadSchema), (req, res) => notificationController.markAsRead(req, res));
//# sourceMappingURL=notificationRoutes.js.map