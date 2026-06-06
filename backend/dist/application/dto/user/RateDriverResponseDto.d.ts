export interface RateDriverResponseDto {
    rideId: string;
    driverId: string;
    ratingId: string;
    overallRating: number;
    driver: {
        driverId: string;
        averageRating: number;
        numberOfRatings: number;
    };
}
//# sourceMappingURL=RateDriverResponseDto.d.ts.map