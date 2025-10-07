export class GoogleLoginRequestDto {
  private code: string;

  constructor(data: { code: string }) {
    this.code = data.code;
  }

  getCode(): string {
    return this.code;
  }
}
