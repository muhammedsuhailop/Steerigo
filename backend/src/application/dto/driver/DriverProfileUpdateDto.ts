export class DriverProfileUpdateDto {
  constructor(
    private readonly userId:string,
    private readonly name?: string,
    private readonly mobile?: string,
    private readonly dob?: Date,
    private readonly gender?: "Male" | "Female" | "Other",
    private readonly address?: string,
    private readonly eligibleGearTypes?: string[],
    private readonly eligibleBodyTypes?: string[]
  ) {}

  getUserId():string{
    return this.userId;
  }
  
  getName(): string | undefined {
    return this.name;
  }

  getMobile(): string | undefined {
    return this.mobile;
  }

  getDob(): Date | undefined {
    return this.dob;
  }

  getGender(): "Male" | "Female" | "Other" | undefined {
    return this.gender;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  getEligibleGearTypes(): string[] | undefined {
    return this.eligibleGearTypes;
  }

  getEligibleBodyTypes(): string[] | undefined {
    return this.eligibleBodyTypes;
  }

  hasUserProfileUpdates(): boolean {
    return !!(
      this.name ||
      this.mobile ||
      this.dob ||
      this.gender ||
      this.address
    );
  }

  hasVehicleTypeUpdates(): boolean {
    return !!(this.eligibleGearTypes || this.eligibleBodyTypes);
  }

  getUserProfileUpdates(): {
    name?: string;
    mobile?: string;
    dob?: Date;
    gender?: string;
    address?: string;
  } {
    const updates: any = {};
    if (this.name) updates.name = this.name;
    if (this.mobile) updates.mobile = this.mobile;
    if (this.dob) updates.dob = this.dob;
    if (this.gender) updates.gender = this.gender;
    if (this.address) updates.address = this.address;
    return updates;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (
      (this.eligibleGearTypes && !this.eligibleBodyTypes) ||
      (!this.eligibleGearTypes && this.eligibleBodyTypes)
    ) {
      errors.push(
        "Both eligibleGearTypes and eligibleBodyTypes must be provided together"
      );
    }

    if (this.eligibleGearTypes && this.eligibleGearTypes.length === 0) {
      errors.push("eligibleGearTypes array cannot be empty");
    }

    if (this.eligibleBodyTypes && this.eligibleBodyTypes.length === 0) {
      errors.push("eligibleBodyTypes array cannot be empty");
    }

    return errors;
  }
}
