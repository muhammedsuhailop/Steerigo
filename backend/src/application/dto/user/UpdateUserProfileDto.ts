export interface UpdateUserProfileInput {
  userId?: string;
  name?: string;
  mobile?: string;
  dob?: string | Date;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  profilePicture?: string;
}

type UserProfileUpdates = {
  name: string;
  mobile: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  address: string;
};

export class UpdateUserProfileDto {
  public readonly userId: string;
  public readonly name?: string;
  public readonly mobile?: string;
  public readonly dob?: Date;
  public readonly gender?: "Male" | "Female" | "Other";
  public readonly address?: string;
  public readonly profilePicture?: string;

  constructor(data: unknown) {
    const input = (data ?? {}) as UpdateUserProfileInput;

    this.userId = input.userId ?? "";
    this.name = input.name?.trim();
    this.mobile = input.mobile?.trim();

    this.dob =
      input.dob instanceof Date
        ? input.dob
        : input.dob
          ? new Date(input.dob)
          : undefined;

    this.gender = input.gender;
    this.address = input.address?.trim();
    this.profilePicture = input.profilePicture?.trim();
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
      const today = new Date();
      const age = today.getFullYear() - this.dob.getFullYear();
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
      this.address ||
      this.profilePicture
    );
  }

  getUserProfileUpdates(): Partial<UserProfileUpdates> {
    const updates: Partial<UserProfileUpdates> = {};

    if (this.name) updates.name = this.name;
    if (this.mobile) updates.mobile = this.mobile;
    if (this.dob) updates.dob = this.dob;
    if (this.gender) updates.gender = this.gender;
    if (this.address !== undefined) updates.address = this.address;

    return updates;
  }
}
