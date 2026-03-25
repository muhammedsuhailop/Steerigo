import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";

const getUserRidesSchema = z.object({
  page: z.coerce.number().positive().optional().default(1),

  limit: z.coerce.number().positive().max(100).optional().default(10),

  sortBy: z
    .enum(["createdAt", "updatedAt", "fare"])
    .optional()
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),

  status: z.nativeEnum(RideStatus).optional(),

  fromDate: z.string().datetime().optional(),

  toDate: z.string().datetime().optional(),
});

type GetUserRidesData = z.infer<typeof getUserRidesSchema>;

export class GetUserRidesDto {
  private readonly userId: string;
  private readonly data: GetUserRidesData;

  constructor(userId: string, queryData: unknown) {
    this.userId = userId;
    this.data = getUserRidesSchema.parse(queryData);
  }

  static fromRequest(userId: string, query: unknown): GetUserRidesDto {
    return new GetUserRidesDto(userId, query);
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

  getSortBy(): string {
    return this.data.sortBy;
  }

  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }

  getStatus(): RideStatus | undefined {
    return this.data.status;
  }

  getFromDate(): Date | undefined {
    return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
  }

  getToDate(): Date | undefined {
    return this.data.toDate ? new Date(this.data.toDate) : undefined;
  }
}

export { getUserRidesSchema };
