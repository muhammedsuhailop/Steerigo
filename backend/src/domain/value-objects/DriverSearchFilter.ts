import { DomainError } from "../errors/DomainError";
import { GearType, BodyType } from "./VehicleType";

export class DriverSearchFilter {
  private readonly gearType: GearType | null;
  private readonly bodyType: BodyType | null;
  private readonly minRating: number;

  private constructor(
    gearType: GearType | null,
    bodyType: BodyType | null,
    minRating: number = 0
  ) {
    this.gearType = gearType;
    this.bodyType = bodyType;
    this.minRating = minRating;
  }

  static create(
    gearType: GearType | string = "",
    bodyType: BodyType | string = "",
    minRating: number = 0
  ): DriverSearchFilter {
    this.validateRating(minRating);

    return new DriverSearchFilter(
      gearType ? (gearType as GearType) : null,
      bodyType ? (bodyType as BodyType) : null,
      minRating
    );
  }

  static empty(): DriverSearchFilter {
    return new DriverSearchFilter(null, null, 0);
  }

  private static validateRating(rating: number): void {
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      throw new DomainError("Rating must be between 0 and 5");
    }
  }

  hasFilters(): boolean {
    return (
      this.gearType !== null || this.bodyType !== null || this.minRating > 0
    );
  }

  getGearType(): GearType | null {
    return this.gearType;
  }

  getBodyType(): BodyType | null {
    return this.bodyType;
  }

  getMinRating(): number {
    return this.minRating;
  }

  matches(
    driverGearTypes: GearType[],
    driverBodyTypes: BodyType[],
    driverRating: number
  ): boolean {
    // Check gear type
    if (this.gearType) {
      if (!driverGearTypes.includes(this.gearType)) {
        return false;
      }
    }

    // Check body type
    if (this.bodyType) {
      if (!driverBodyTypes.includes(this.bodyType)) {
        return false;
      }
    }

    // Check rating
    if (driverRating < this.minRating) return false;

    return true;
  }
}
