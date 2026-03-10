import { z } from "zod";

const getPendingRideRequestsSchema = z.object({
  limit: z.number().positive().optional().default(10),
  offset: z.number().min(0).optional().default(0),
});

type GetPendingRideRequestsData = z.infer<typeof getPendingRideRequestsSchema>;

export class GetPendingRideRequestsDto {
  private readonly userId: string;
  private readonly data: GetPendingRideRequestsData;

  constructor(userId: string, queryData: unknown) {
    this.userId = userId;
    this.data = getPendingRideRequestsSchema.parse(queryData);
  }

  static fromRequest(
    userId: string,
    query: unknown,
  ): GetPendingRideRequestsDto {
    return new GetPendingRideRequestsDto(userId, query);
  }

  getUserId(): string {
    return this.userId;
  }

  getLimit(): number {
    return this.data.limit;
  }

  getOffset(): number {
    return this.data.offset;
  }
}

export { getPendingRideRequestsSchema };
