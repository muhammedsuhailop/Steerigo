export interface RejectRideRequestResponseDto {
  requestId: string;
  status: string;
  rejectedAt: string;
  reason?: string;
}
