export interface AdminRideStatsDto {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalAmount: number;
  currency: string;
}

export interface RatingDistributionDto {
  zeroToOne: number;
  oneToTwo: number;
  twoToThree: number;
  threeToFour: number;
  fourToFive: number;
}

export interface AdminRatingStatsDto {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistributionDto;
}

export interface GetAdminRideStatsResponseDto {
  fromDate: string;
  toDate: string;
  rideStats: AdminRideStatsDto;
  ratingStats: AdminRatingStatsDto;
}
