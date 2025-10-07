export interface GetCurrentUserResponseDto {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  profilePicture?: string;
  isVerified: boolean;
  authProvider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
