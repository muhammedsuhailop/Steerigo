import { z } from "zod";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";

export const getAdminWalletSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    type: z.nativeEnum(TransactionType).optional(),
    direction: z.nativeEnum(TransactionDirection).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
  }),
});
