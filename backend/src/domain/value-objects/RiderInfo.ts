export interface RiderInfo {
  userId: string;
  name: string;
  mobile: string;
}

export class RiderInfoValueObject {
  private constructor(
    private readonly userId: string,
    private readonly name: string,
    private readonly mobile: string
  ) {}

  static create(
    userId: string,
    name: string,
    mobile: string
  ): RiderInfoValueObject {
    if (!userId || !name || !mobile) {
      throw new Error("All rider info fields are required");
    }
    return new RiderInfoValueObject(userId, name, mobile);
  }

  getId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getMobile(): string {
    return this.mobile;
  }

  toObject(): RiderInfo {
    return {
      userId: this.userId,
      name: this.name,
      mobile: this.mobile,
    };
  }
}
