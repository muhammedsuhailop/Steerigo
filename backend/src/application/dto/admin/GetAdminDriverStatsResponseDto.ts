export interface DriverStatusBreakdownDto {
  active: number;
  blocked: number;
  suspended: number;
}

export interface KycStatusBreakdownDto {
  approved: number;
  inReview: number;
  rejected: number;
}

export interface AdminDriverStatsDto {
  totalDrivers: number;
  newDrivers: number;
  statusBreakdown: DriverStatusBreakdownDto;
  kycBreakdown: KycStatusBreakdownDto;
}

export interface GetAdminDriverStatsResponseDto {
  fromDate: string;
  toDate: string;
  driverStats: AdminDriverStatsDto;
}
