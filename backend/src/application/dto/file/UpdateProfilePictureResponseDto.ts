export class UpdateProfilePictureResponseDto {
  readonly profilePictureUrl: string;
  readonly publicId: string;
  readonly userId: string;
  readonly updatedAt: string;

  constructor(
    profilePictureUrl: string,
    publicId: string,
    userId: string,
    updatedAt: string
  ) {
    this.profilePictureUrl = profilePictureUrl;
    this.publicId = publicId;
    this.userId = userId;
    this.updatedAt = updatedAt;
  }
}
