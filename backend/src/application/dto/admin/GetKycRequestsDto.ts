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

  constructor(data: any) {
    this.page = parseInt(data.page) || 1;
    this.pageSize = Math.min(parseInt(data.pageSize) || 10, 50);
    this.docType = data.docType;
    this.isVerified =
      data.isVerified === "true"
        ? true
        : data.isVerified === "false"
          ? false
          : undefined;
    this.search = data.search?.trim();
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.sortBy = this.validateSortBy(data.sortBy || "createdAt");
    this.sortOrder = data.sortOrder === "desc" ? "desc" : "asc";
  }

  private validateSortBy(sortBy: string): string {
    const allowed = ["driverName", "docType", "createdAt", "status"];
    return allowed.includes(sortBy) ? sortBy : "createdAt";
  }
}
