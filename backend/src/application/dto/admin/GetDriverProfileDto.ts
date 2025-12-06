export interface GetDriverProfileInput{
  driverId: string;

}
export class GetDriverProfileDto {
  public readonly driverId: string;

  constructor(data: GetDriverProfileInput) {
    this.driverId = data.driverId;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.driverId) {
      errors.push("Driver ID is required");
    }

    return errors;
  }
}
