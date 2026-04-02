import { z } from "zod";
import { ReviewType } from "@domain/value-objects/ReviewType";

export const getAdminRatingsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),

  sortBy: z.enum(["createdAt", "overallRating"]).default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  reviewType: z.nativeEnum(ReviewType).optional(),

  reviewerId: z.string().optional(),
  revieweeId: z.string().optional(),
  rideId: z.string().optional(),

  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),

  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

type GetAdminRatingsData = z.infer<typeof getAdminRatingsSchema>;

export class GetAdminRatingsDto {
  private readonly data: GetAdminRatingsData;

  constructor(queryData: unknown) {
    this.data = getAdminRatingsSchema.parse(queryData);
  }

  static fromRequest(query: unknown): GetAdminRatingsDto {
    return new GetAdminRatingsDto(query);
  }

  getPage(): number {
    return this.data.page;
  }

  getLimit(): number {
    return this.data.limit;
  }

  getSortBy(): "createdAt" | "overallRating" {
    return this.data.sortBy;
  }

  getSortOrder(): "asc" | "desc" {
    return this.data.sortOrder;
  }

  getReviewType(): ReviewType | undefined {
    return this.data.reviewType;
  }

  getReviewerId(): string | undefined {
    return this.data.reviewerId;
  }

  getRevieweeId(): string | undefined {
    return this.data.revieweeId;
  }

  getRideId(): string | undefined {
    return this.data.rideId;
  }

  getMinRating(): number | undefined {
    return this.data.minRating;
  }

  getMaxRating(): number | undefined {
    return this.data.maxRating;
  }

  getFromDate(): Date | undefined {
    return this.data.fromDate ? new Date(this.data.fromDate) : undefined;
  }

  getToDate(): Date | undefined {
    return this.data.toDate ? new Date(this.data.toDate) : undefined;
  }
}
