import { RatingCriteriaType } from "./RatingCriteriaType";
export declare class RatingCriteria {
    private readonly criteria;
    private constructor();
    static create(input: Partial<Record<RatingCriteriaType, number>>): RatingCriteria;
    getValue(): Map<RatingCriteriaType, number>;
    toObject(): Record<string, number>;
    getAverage(): number;
}
//# sourceMappingURL=RatingCriteria.d.ts.map