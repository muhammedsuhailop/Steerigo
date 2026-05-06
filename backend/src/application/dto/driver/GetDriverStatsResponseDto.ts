export interface RideStatsDto {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  currency: string;
}

export interface RatingDistributionDto {
  zeroToOne: number;
  oneToTwo: number;
  twoToThree: number;
  threeToFour: number;
  fourToFive: number;
}

export interface RatingStatsDto {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistributionDto;
}

export interface GetDriverStatsResponseDto {
  driverId: string;
  fromDate: string;
  toDate: string;
  rideStats: RideStatsDto;
  ratingStats: RatingStatsDto;
}
