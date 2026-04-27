import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { AdminWalletController } from "@interface/controllers/admin/AdminWalletController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import { handleValidationErrors } from "@interface/middleware/errorHandler";
import { getAdminWalletSchema } from "@interface/validators/admin/adminWalletValidators";

const router = Router();
const controller = container.get<AdminWalletController>(
  TYPES.AdminWalletController,
);


// GET /api/admin/wallet
router.get(
  "/",
  validateSchema(getAdminWalletSchema),
  handleValidationErrors,
  (req: Request, res: Response) => controller.getWallet(req, res),
);

export { router as adminWalletRoutes };
