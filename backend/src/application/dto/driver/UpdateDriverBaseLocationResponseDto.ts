export interface UpdateDriverBaseLocationResponseDto {
  availabilityId: string;
  driverId: string;
  baseLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  updatedAt: string;
}
