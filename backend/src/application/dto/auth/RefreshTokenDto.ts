export class RefreshTokenDto {
  public readonly refreshToken: string;
  constructor(data: { refreshToken: string }) {
    this.refreshToken = data.refreshToken;
  }

  static fromRequest(data: { refreshToken: string }): RefreshTokenDto {
    return new RefreshTokenDto(data);
  }
}
