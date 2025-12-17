import { Gender } from "@domain/value-objects/Gender";

export interface UpdateUserProfileInput {
  userId?: string;
  name?: string;
  mobile?: string;
  dob?: string | Date;
  gender?: Gender;
  address?: string;
  profilePicture?: string;
}

interface UpdateUserProfileRequestBody {
  name?: string;
  mobile?: string;
  dob?: string;
  gender?: Gender;
  address?: string;
  profilePicture?: string;
}

type UserProfileUpdates = {
  name: string;
  mobile: string;
  dob: Date;
  gender: Gender;
  address: string;
};

export class UpdateUserProfileDto {
  public readonly userId: string;
  public readonly name?: string;
  public readonly mobile?: string;
  public readonly dob?: Date;
  public readonly gender?: Gender;
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

  static fromRequest(
    userId: string,
    requestBody: unknown
  ): UpdateUserProfileDto {
    const input = (requestBody ?? {}) as UpdateUserProfileRequestBody;
    return new UpdateUserProfileDto({
      userId,
      ...input,
    });
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push("User ID is required");
    }

    if (!this.name) {
      errors.push("Name is required");
    } else if (this.name.length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!this.mobile) {
      errors.push("Mobile number is required");
    } else if (!/^\d{10,}$/.test(this.mobile)) {
      errors.push("Mobile number must contain at least 10 digits");
    }

    if (this.dob !== undefined) {
      const today = new Date();
      let age = today.getFullYear() - this.dob.getFullYear();

      const monthDiff = today.getMonth() - this.dob.getMonth();
      const dayDiff = today.getDate() - this.dob.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 10 || age > 120) {
        errors.push("Age must be between 10 and 120 years");
      }
    }

    if (
      this.gender !== undefined &&
      !Object.values(Gender).includes(this.gender)
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
