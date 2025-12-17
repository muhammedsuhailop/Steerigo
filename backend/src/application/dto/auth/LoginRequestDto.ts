export class LoginRequestDto {
  private email: string;
  private password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
  }

  static fromrequest(data: {
    email: string;
    password: string;
  }): LoginRequestDto {
    return new LoginRequestDto(data);
  }

  getEmailValue(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}
