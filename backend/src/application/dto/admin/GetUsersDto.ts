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

  constructor(data: any) {
    this.page = parseInt(data.page) || 1;
    this.pageSize = Math.min(parseInt(data.pageSize) || 10, 50);
    this.status = data.status;
    this.search = data.search?.trim();
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.sortBy = this.validateSortBy(data.sortBy || "createdAt");
    this.sortOrder = data.sortOrder === "desc" ? "desc" : "asc";
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
