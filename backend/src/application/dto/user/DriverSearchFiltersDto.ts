export class DriverSearchFiltersDto {
  constructor(
    readonly gearType?: string,
    readonly bodyType?: string,
    readonly minRating?: number
  ) {}

  hasFilters(): boolean {
    return (
      (this.gearType && this.gearType.trim().length > 0) ||
      (this.bodyType && this.bodyType.trim().length > 0) ||
      this.minRating !== undefined
    );
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.minRating !== undefined) {
      if (
        typeof this.minRating !== "number" ||
        this.minRating < 0 ||
        this.minRating > 5
      ) {
        errors.push("Minimum rating must be between 0 and 5");
      }
    }

    return errors;
  }
}
