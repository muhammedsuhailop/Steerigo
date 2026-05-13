import { z } from "zod";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";

const getFutureRideRequestsDtoSchema = z.object({
  status: z.nativeEnum(FutureRideRequestStatus).optional(),

  page: z.coerce.number().int().positive().optional().default(1),

  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

type GetFutureRideRequestsData = z.infer<typeof getFutureRideRequestsDtoSchema>;

export class GetFutureRideRequestsDto {
  private readonly userId: string;
  private readonly data: GetFutureRideRequestsData;

  constructor(userId: string, queryData: unknown) {
    this.userId = userId;
    this.data = getFutureRideRequestsDtoSchema.parse(queryData);
  }

  static fromRequest(userId: string, query: unknown): GetFutureRideRequestsDto {
    return new GetFutureRideRequestsDto(userId, query);
  }

  getUserId(): string {
    return this.userId;
  }

  getStatus(): FutureRideRequestStatus | undefined {
    return this.data.status;
  }

  getPage(): number {
    return this.data.page;
  }

  getLimit(): number {
    return this.data.limit;
  }

  getOffset(): number {
    return (this.getPage() - 1) * this.getLimit();
  }
}

export { getFutureRideRequestsDtoSchema };
