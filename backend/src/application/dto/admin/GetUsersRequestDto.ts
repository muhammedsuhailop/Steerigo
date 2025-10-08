import { z } from "zod";

const getUsersRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z
    .enum(["Active", "Inactive", "Suspended", "Pending Verification"])
    .optional(),
  search: z.string().min(1).max(255).optional(),
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
  sortBy: z
    .enum(["name", "email", "createdAt", "totalBookings", "totalSpent"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AdminUsersQuery = {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

type GetUsersRequestData = z.infer<typeof getUsersRequestSchema>;

export class GetUsersRequestDto {
  private readonly data: GetUsersRequestData;

  constructor(queryParams: any) {
    this.data = getUsersRequestSchema.parse(queryParams);
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

  getSearch(): string | undefined {
    return this.data.search;
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
