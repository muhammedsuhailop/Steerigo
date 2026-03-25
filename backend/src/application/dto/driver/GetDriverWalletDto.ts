import { z } from "zod";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";

const getDriverWalletSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  type: z.nativeEnum(TransactionType).optional(),
  direction: z.nativeEnum(TransactionDirection).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

type GetDriverWalletData = z.infer<typeof getDriverWalletSchema>;

export class GetDriverWalletDto {
  private readonly userId: string;
  private readonly data: GetDriverWalletData;

  constructor(userId: string, queryData: unknown) {
    this.userId = userId;
    this.data = getDriverWalletSchema.parse(queryData);
  }

  static fromRequest(userId: string, query: unknown): GetDriverWalletDto {
    return new GetDriverWalletDto(userId, query);
  }

  getUserId(): string {
    return this.userId;
  }
  getPage(): number {
    return this.data.page;
  }
  getLimit(): number {
    return this.data.limit;
  }
  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }
  getType(): TransactionType | undefined {
    return this.data.type;
  }
  getDirection(): TransactionDirection | undefined {
    return this.data.direction;
  }

  getFromDate(): Date | undefined {
    return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
  }

  getToDate(): Date | undefined {
    return this.data.toDate ? new Date(this.data.toDate) : undefined;
  }
}

export { getDriverWalletSchema };
