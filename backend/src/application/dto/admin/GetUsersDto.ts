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

  constructor(data: any) {
    this.page = parseInt(data.page) || 1;
    this.pageSize = Math.min(parseInt(data.pageSize) || 10, 50);
    this.status = data.status;
    this.search = data.search?.trim();
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
  }
}
