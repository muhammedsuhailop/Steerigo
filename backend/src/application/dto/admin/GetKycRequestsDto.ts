export interface GetKycRequestsInput {
  page?: string;
  pageSize?: string;
  docType?: "Aadhaar" | "PAN" | "DrivingLicense" | "Passport";
  isVerified?: "true" | "false";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class GetKycRequestsDto {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly docType?: "Aadhaar" | "PAN" | "DrivingLicense" | "Passport";
  public readonly isVerified?: boolean;
  public readonly search?: string;
  public readonly dateFrom?: string;
  public readonly dateTo?: string;
  public readonly sortBy: string;
  public readonly sortOrder: "asc" | "desc";

  constructor(data: unknown) {
    const input = (data ?? {}) as GetKycRequestsInput;

    this.page = this.parsePositiveInt(input.page, 1);
    this.pageSize = Math.min(this.parsePositiveInt(input.pageSize, 10), 50);

    this.docType = input.docType;

    this.isVerified =
      input.isVerified === "true"
        ? true
        : input.isVerified === "false"
          ? false
          : undefined;

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
    const allowed = ["driverName", "docType", "createdAt", "status"];
    return allowed.includes(sortBy) ? sortBy : "createdAt";
  }
}
