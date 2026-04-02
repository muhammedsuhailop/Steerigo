import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";

export class Coupon {
  private constructor(
    private readonly id: string,
    private readonly code: string,
    private readonly discountType: CouponDiscountType,
    private readonly discountValue: number,
    private readonly maxDiscount: number | undefined,
    private readonly minRideAmount: number | undefined,
    private readonly usageLimit: number | undefined,
    private readonly usagePerUser: number | undefined,
    private readonly validFrom: Date | undefined,
    private readonly validTo: Date | undefined,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    id: string,
    code: string,
    discountType: CouponDiscountType,
    discountValue: number,
    maxDiscount?: number,
    minRideAmount?: number,
    usageLimit?: number,
    usagePerUser?: number,
    validFrom?: Date,
    validTo?: Date,
  ): Coupon {
    if (!id || !code) {
      throw new Error("Coupon ID and code are required");
    }

    if (discountValue <= 0) {
      throw new Error("Discount value must be greater than 0");
    }

    if (validFrom && validTo && validFrom >= validTo) {
      throw new Error("Invalid validity period");
    }

    return new Coupon(
      id,
      code.trim().toUpperCase(),
      discountType,
      discountValue,
      maxDiscount,
      minRideAmount,
      usageLimit,
      usagePerUser,
      validFrom,
      validTo,
      true,
      new Date(),
      new Date(),
    );
  }

  static fromData(data: {
    id: string;
    code: string;
    discountType: CouponDiscountType;
    discountValue: number;
    maxDiscount?: number;
    minRideAmount?: number;
    usageLimit?: number;
    usagePerUser?: number;
    validFrom?: Date;
    validTo?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Coupon {
    return new Coupon(
      data.id,
      data.code,
      data.discountType,
      data.discountValue,
      data.maxDiscount,
      data.minRideAmount,
      data.usageLimit,
      data.usagePerUser,
      data.validFrom,
      data.validTo,
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }

  isValidNow(currentDate: Date): boolean {
    if (!this.isActive) return false;

    if (this.validFrom && currentDate < this.validFrom) {
      return false;
    }

    if (this.validTo && currentDate > this.validTo) {
      return false;
    }

    return true;
  }

  isMinimumAmountSatisfied(amount: number): boolean {
    if (!this.minRideAmount) return true;
    return amount >= this.minRideAmount;
  }

  calculateDiscount(amount: number): number {
    if (amount <= 0) return 0;

    let discount = 0;

    if (this.discountType === CouponDiscountType.FLAT) {
      discount = this.discountValue;
    } else {
      discount = (amount * this.discountValue) / 100;

      if (this.maxDiscount !== undefined) {
        discount = Math.min(discount, this.maxDiscount);
      }
    }

    return Math.min(discount, amount);
  }

  activate(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.isActive) return;
    this.isActive = false;
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getCode(): string {
    return this.code;
  }

  getDiscountType(): CouponDiscountType {
    return this.discountType;
  }

  getDiscountValue(): number {
    return this.discountValue;
  }

  getMaxDiscount(): number | undefined {
    return this.maxDiscount;
  }

  getMinRideAmount(): number | undefined {
    return this.minRideAmount;
  }

  getUsageLimit(): number | undefined {
    return this.usageLimit;
  }

  getUsagePerUser(): number | undefined {
    return this.usagePerUser;
  }

  getValidFrom(): Date | undefined {
    return this.validFrom;
  }

  getValidTo(): Date | undefined {
    return this.validTo;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
