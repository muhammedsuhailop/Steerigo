export interface SignupResponseDto {
  message: string;
  email: string;
  otpExpiresAt: Date;
}
