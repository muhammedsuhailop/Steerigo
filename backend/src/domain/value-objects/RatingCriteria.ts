import { RatingCriteriaType } from "./RatingCriteriaType";

export class RatingCriteria {
  private readonly criteria: Map<RatingCriteriaType, number>;

  private constructor(criteria: Map<RatingCriteriaType, number>) {
    this.criteria = criteria;
  }

  static create(
    input: Partial<Record<RatingCriteriaType, number>>,
  ): RatingCriteria {
    const criteriaMap = new Map<RatingCriteriaType, number>();

    for (const key of Object.values(RatingCriteriaType)) {
      const value = input[key] ?? 0;

      if (value < 0 || value > 5) {
        throw new Error(`${key} must be between 0 and 5`);
      }

      criteriaMap.set(key, value);
    }

    return new RatingCriteria(criteriaMap);
  }

  getValue(): Map<RatingCriteriaType, number> {
    return new Map(this.criteria);
  }

  toObject(): Record<string, number> {
    const obj: Record<string, number> = {};

    for (const [key, value] of this.criteria.entries()) {
      obj[key] = value;
    }

    return obj;
  }

  getAverage(): number {
    const values = Array.from(this.criteria.values());
    const sum = values.reduce((a, b) => a + b, 0);
    return parseFloat((sum / values.length).toFixed(2));
  }
}
