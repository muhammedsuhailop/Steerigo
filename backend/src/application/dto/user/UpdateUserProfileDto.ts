export class UpdateUserProfileDto {
  public readonly userId: string;
  public readonly name?: string;
  public readonly mobile?: string;
  public readonly dob?: string;
  public readonly gender?: "Male" | "Female" | "Other";
  public readonly address?: string;

  constructor(data: any) {
    this.userId = data.userId;
    this.name = data.name?.trim();
    this.mobile = data.mobile?.trim();
    this.dob = data.dob;
    this.gender = data.gender;
    this.address = data.address?.trim();
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push("User ID is required");
    }

    if (this.name !== undefined && this.name.length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (this.mobile !== undefined && !/^[6-9]\d{9}$/.test(this.mobile)) {
      errors.push("Please provide a valid 10-digit mobile number");
    }

    if (this.dob !== undefined) {
      const dobDate = new Date(this.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();

      if (age < 10 || age > 100) {
        errors.push("Age must be between 10 and 100 years");
      }
    }

    if (
      this.gender !== undefined &&
      !["Male", "Female", "Other"].includes(this.gender)
    ) {
      errors.push("Gender must be Male, Female, or Other");
    }

    if (this.address !== undefined && this.address.length > 500) {
      errors.push("Address must be less than 500 characters");
    }

    return errors;
  }

  hasUpdates(): boolean {
    return !!(
      this.name ||
      this.mobile ||
      this.dob ||
      this.gender ||
      this.address
    );
  }
}
