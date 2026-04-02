import { z } from "zod";
import { RideStatus } from "@domain/value-objects/RideStatus";

const getAdminRidesSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),

  sortBy: z.enum(["createdAt", "updatedAt", "fare"]).default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  status: z.nativeEnum(RideStatus).optional(),

  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),

  riderId: z.string().optional(),
  driverId: z.string().optional(),
});

type GetAdminRidesData = z.infer<typeof getAdminRidesSchema>;

export class GetAdminRidesDto {
  private readonly data: GetAdminRidesData;

  constructor(queryData: unknown) {
    this.data = getAdminRidesSchema.parse(queryData);
  }

  static fromRequest(query: unknown): GetAdminRidesDto {
    return new GetAdminRidesDto(query);
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

  getRiderId(): string | undefined {
    return this.data.riderId;
  }

  getDriverId(): string | undefined {
    return this.data.driverId;
  }
}

export { getAdminRidesSchema };
