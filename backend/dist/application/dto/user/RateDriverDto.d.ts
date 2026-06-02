import { RatingCriteria } from "@domain/value-objects/RatingCriteria";
import { ReviewType } from "@domain/value-objects/ReviewType";
export declare class RateDriverDto {
    private readonly riderId;
    readonly rideId: string;
    readonly reviewType: ReviewType;
    private readonly criteriaInput;
    readonly review?: string;
    private constructor();
    static fromRequest(riderId: string, params: {
        rideId?: string;
    }, body: unknown): RateDriverDto;
    getRiderId(): string;
    getCriteria(): RatingCriteria;
    getOverallRating(): number;
    validate(): void;
}
//# sourceMappingURL=RateDriverDto.d.ts.map