export class UpdateDriverKycStatusResponseDto {
  readonly message: string;
  readonly driverId: string;
  readonly previousKycStatus: string;
  readonly newKycStatus: string;

  constructor(
    message: string,
    driverId: string,
    previousKycStatus: string,
    newKycStatus: string
  ) {
    this.message = message;
    this.driverId = driverId;
    this.previousKycStatus = previousKycStatus;
    this.newKycStatus = newKycStatus;
  }
}
