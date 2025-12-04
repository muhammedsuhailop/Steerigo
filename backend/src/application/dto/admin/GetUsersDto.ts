export interface GetUsersInput {
  page?: string;
  pageSize?: string;
  status?:
    | "Active"
    | "Suspended"
    | "Pending Verification"
    | "Inactive"
    | "Blocked";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class GetUsersDto {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly status?:
    | "Active"
    | "Suspended"
    | "Pending Verification"
    | "Inactive"
    | "Blocked";
  public readonly search?: string;
  public readonly dateFrom?: string;
  public readonly dateTo?: string;
  public readonly sortBy: string;
  public readonly sortOrder: "asc" | "desc";

  constructor(data: unknown) {
    const input = (data ?? {}) as GetUsersInput;

    this.page = this.parsePositiveInt(input.page, 1);
    this.pageSize = Math.min(this.parsePositiveInt(input.pageSize, 10), 50);

    this.status = input.status;
    this.search = input.search?.trim();
    this.dateFrom = input.dateFrom;
    this.dateTo = input.dateTo;
    this.sortBy = this.validateSortBy(input.sortBy ?? "createdAt");
    this.sortOrder = input.sortOrder === "desc" ? "desc" : "asc";
  }

  private parsePositiveInt(
    value: string | undefined,
    fallback: number
  ): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  private validateSortBy(sortBy: string): string {
    const allowedSortFields = [
      "name",
      "email",
      "totalBookings",
      "totalSpent",
      "createdAt",
      "lastBooked",
      "status",
    ];
    return allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  }
}
