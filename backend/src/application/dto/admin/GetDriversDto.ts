export interface GetDriversInput {
  page?: string;
  pageSize?: string;
  status?:
    | "Active"
    | "Blocked"
    | "InReview"
    | "Pending"
    | "Verified"
    | "Rejected";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  kycStatus?: "Pending" | "Verified" | "Rejected";
}

export class GetDriversDto {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly status?:
    | "Active"
    | "Blocked"
    | "InReview"
    | "Pending"
    | "Verified"
    | "Rejected";
  public readonly search?: string;
  public readonly dateFrom?: string;
  public readonly dateTo?: string;
  public readonly sortBy: string;
  public readonly sortOrder: "asc" | "desc";
  public readonly kycStatus?: "Pending" | "Verified" | "Rejected";

  constructor(data: unknown) {
    const input = (data ?? {}) as GetDriversInput;

    this.page = this.parsePositiveInt(input.page, 1);
    this.pageSize = Math.min(this.parsePositiveInt(input.pageSize, 10), 50);

    this.status = input.status;
    this.search = input.search?.trim();
    this.dateFrom = input.dateFrom;
    this.dateTo = input.dateTo;

    this.sortBy = this.validateSortBy(input.sortBy ?? "createdAt");
    this.sortOrder = input.sortOrder === "desc" ? "desc" : "asc";
    this.kycStatus = input.kycStatus;
  }

  private parsePositiveInt(
    value: string | undefined,
    fallback: number
  ): number {
    const n = parseInt(value || "", 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  private validateSortBy(sortBy: string): string {
    const allowedSortFields = [
      "name",
      "email",
      "totalRides",
      "totalEarned",
      "createdAt",
      "lastRide",
      "status",
      "kycStatus",
    ];
    return allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  }
}
