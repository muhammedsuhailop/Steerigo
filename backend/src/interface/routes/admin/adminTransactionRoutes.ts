import { Router, Request, Response } from "express";
import { container } from "@infrastructure/container/DIContainer";
import { TYPES } from "@shared/constants/DITypes";
import { AdminTransactionController } from "@interface/controllers/admin/AdminTransactionController";
import { validateSchema } from "@interface/middleware/ValidationMiddleware";
import { getAdminTransactionsSchema } from "@interface/validators/admin/transactionValidators";

const router = Router();
const controller = container.get<AdminTransactionController>(
  TYPES.AdminTransactionController,
);

// GET /api/admin/transactions
router.get(
  "/",
  validateSchema(getAdminTransactionsSchema),
  (req: Request, res: Response) => controller.getTransactions(req, res),
);

export { router as adminTransactionRoutes };
