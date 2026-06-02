export interface RejectRideRequestResponseDto {
    success: boolean;
    message: string;
    data: {
        requestId: string;
        status: string;
        rejectedAt: string;
        reason?: string;
    };
}
//# sourceMappingURL=RejectRideRequestResponseDto.d.ts.map