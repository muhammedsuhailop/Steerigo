import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export class GetAdminPayoutsDto {
  private constructor(
    private readonly status: PayoutStatus | undefined,
    private readonly driverId: string | undefined,
    private readonly page: number,
    private readonly limit: number,
    private readonly sortBy: "createdAt" | "amount",
    private readonly sortOrder: "asc" | "desc",
  ) {}

  static create(params: {
    status?: PayoutStatus;
    driverId?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "amount";
    sortOrder?: "asc" | "desc";
  }): GetAdminPayoutsDto {
    return new GetAdminPayoutsDto(
      params.status,
      params.driverId,
      params.page ?? 1,
      params.limit ?? 10,
      params.sortBy ?? "createdAt",
      params.sortOrder ?? "desc",
    );
  }

  getStatus(): PayoutStatus | undefined {
    return this.status;
  }
  getDriverId(): string | undefined {
    return this.driverId;
  }
  getPage(): number {
    return this.page;
  }
  getLimit(): number {
    return this.limit;
  }
  getSortBy(): "createdAt" | "amount" {
    return this.sortBy;
  }
  getSortOrder(): "asc" | "desc" {
    return this.sortOrder;
  }
}
