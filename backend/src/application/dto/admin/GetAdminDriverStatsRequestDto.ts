import { ValidationError } from "@domain/errors/ValidationErrors";
import { z } from "zod";

export const getAdminDriverStatsSchema = z
  .object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate;
      }
      return true;
    },
    {
      message: "fromDate must be less than or equal to toDate",
      path: ["fromDate"],
    },
  );

export class GetAdminDriverStatsRequestDto {
  private constructor(
    private readonly fromDate?: Date,
    private readonly toDate?: Date,
  ) {}

  static fromRequest(
    query: Record<string, unknown>,
  ): GetAdminDriverStatsRequestDto {
    const parsed = getAdminDriverStatsSchema.safeParse(query);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      const field =
        typeof firstError.path[0] === "string" ? firstError.path[0] : undefined;
      throw new ValidationError(firstError.message, field);
    }

    const { fromDate, toDate } = parsed.data;
    return new GetAdminDriverStatsRequestDto(fromDate, toDate);
  }

  getFromDate(): Date | undefined {
    return this.fromDate;
  }

  getToDate(): Date | undefined {
    return this.toDate;
  }
}
