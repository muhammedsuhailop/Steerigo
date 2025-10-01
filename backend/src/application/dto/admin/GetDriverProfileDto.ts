export class GetDriverProfileDto {
  public readonly driverId: string;

  constructor(data: any) {
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
