export class GetUserStatsRequestDto {
  private constructor(
    private readonly fromDate?: Date,
    private readonly toDate?: Date,
  ) {}

  static fromRequest(query: Record<string, unknown>): GetUserStatsRequestDto {
    const fromDate =
      typeof query.fromDate === "string" ? new Date(query.fromDate) : undefined;

    const toDate =
      typeof query.toDate === "string" ? new Date(query.toDate) : undefined;

    return new GetUserStatsRequestDto(fromDate, toDate);
  }

  getFromDate(): Date | undefined {
    return this.fromDate;
  }

  getToDate(): Date | undefined {
    return this.toDate;
  }
}
