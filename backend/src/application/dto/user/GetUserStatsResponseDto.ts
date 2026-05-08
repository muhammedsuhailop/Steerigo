export interface UserRideStatsDto {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpend: number;
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

export interface GetUserStatsResponseDto {
  userId: string;
  fromDate: string;
  toDate: string;
  rideStats: UserRideStatsDto;
  ratingStats: RatingStatsDto;
}
