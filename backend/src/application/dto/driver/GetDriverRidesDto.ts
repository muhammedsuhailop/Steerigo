import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";

const getDriverRidesSchema = z.object({
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().max(100).optional().default(10),
  sortBy: z
    .enum(["createdAt", "updatedAt", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  status: z.nativeEnum(RideStatus).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

type GetDriverRidesData = z.infer<typeof getDriverRidesSchema>;

export class GetDriverRidesDto {
  private readonly userId: string;
  private readonly data: GetDriverRidesData;

  constructor(userId: string, queryData: unknown) {
    this.userId = userId;
    this.data = getDriverRidesSchema.parse(queryData);
  }

  static fromRequest(userId: string, query: unknown): GetDriverRidesDto {
    return new GetDriverRidesDto(userId, query);
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

export { getDriverRidesSchema };
