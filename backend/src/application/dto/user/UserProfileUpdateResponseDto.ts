import { UserResponseDto } from "./UserResponseDto";

export interface UserProfileUpdateResponseDto {
  user: UserResponseDto;
  updatedFields: string[];
}
