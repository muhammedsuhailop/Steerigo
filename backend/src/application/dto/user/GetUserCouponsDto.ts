import { ValidationError } from "@domain/errors/ValidationErrors";
import { z } from "zod";

export const getUserCouponsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, { message: "Page must be greater than 0" })
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit must be at most 100" })
    .default(10),
});

export class GetUserCouponsDto {
  private constructor(
    private readonly userId: string,
    private readonly page: number,
    private readonly limit: number,
  ) {}

  static fromRequest(
    userId: string,
    query: Record<string, unknown>,
  ): GetUserCouponsDto {
    const parsed = getUserCouponsSchema.safeParse(query);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      throw new ValidationError(
        firstError.message,
        firstError.path[0] as string,
      );
    }

    const { page, limit } = parsed.data;

    return new GetUserCouponsDto(userId, page, limit);
  }

  getUserId(): string {
    return this.userId;
  }

  getPage(): number {
    return this.page;
  }

  getLimit(): number {
    return this.limit;
  }
}
