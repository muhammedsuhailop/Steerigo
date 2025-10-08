import { z } from "zod";

const getKycRequestsRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["Pending", "Under Review", "Approved", "Rejected"])
    .optional(),
  driverId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid KYC ID format").optional(),
  dateFrom: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
      z.string().datetime(),
    ])
    .optional(),
  dateTo: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
      z.string().datetime(),
    ])
    .optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

type GetKycRequestsRequestData = z.infer<typeof getKycRequestsRequestSchema>;

export class GetKycRequestsRequestDto {
  private readonly data: GetKycRequestsRequestData;

  constructor(queryParams: any) {
    this.data = getKycRequestsRequestSchema.parse(queryParams);
  }

  getPage(): number {
    return this.data.page;
  }

  getPageSize(): number {
    return this.data.pageSize;
  }

  getStatus(): string | undefined {
    return this.data.status;
  }

  getDriverId(): string | undefined {
    return this.data.driverId;
  }

  getDateFrom(): Date | undefined {
    return this.data.dateFrom ? new Date(this.data.dateFrom) : undefined;
  }

  getDateTo(): Date | undefined {
    return this.data.dateTo ? new Date(this.data.dateTo) : undefined;
  }

  getSortBy(): string {
    return this.data.sortBy;
  }

  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }
}
