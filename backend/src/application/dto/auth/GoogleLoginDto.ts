export class GoogleLoginDto {
  public readonly code: string;
  public readonly state?: string;

  constructor(data: any) {
    this.code = data.code;
    this.state = data.state;
  }
}
