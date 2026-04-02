import { z } from "zod";

export const getAdminTransactionsSchema = z.object({
  query: z.object({
    walletId: z.string().optional(),
    ownerId: z.string().optional(),
    ownerType: z.string().optional(),
    type: z.string().optional(),
    direction: z.string().optional(),
    relatedEntityId: z.string().optional(),
    relatedEntityType: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    sortBy: z.enum(["createdAt", "amount"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
