import { Email } from "@domain/value-objects/Email";

export interface UserResponseDto {
  id: string;
  name: string;
  email: Email;
  mobile?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  role: string;
  status: string;
  isVerified: boolean;
  profilePicture?: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}
