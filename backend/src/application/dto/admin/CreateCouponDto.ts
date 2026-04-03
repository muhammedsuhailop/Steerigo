import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { CouponErrors } from "@domain/errors/CouponErrors";

interface CreateCouponRequestBody {
  code?: string;
  discountType?: string;
  discountValue?: number;
  maxDiscount?: number;
  minRideAmount?: number;
  usageLimit?: number;
  usagePerUser?: number;
  validFrom?: string;
  validTo?: string;
}

export class CreateCouponDto {
  public readonly code: string;
  public readonly discountType: CouponDiscountType;
  public readonly discountValue: number;
  public readonly maxDiscount?: number;
  public readonly minRideAmount?: number;
  public readonly usageLimit?: number;
  public readonly usagePerUser?: number;
  public readonly validFrom?: Date;
  public readonly validTo?: Date;

  private constructor(
    code: string,
    discountType: CouponDiscountType,
    discountValue: number,
    maxDiscount?: number,
    minRideAmount?: number,
    usageLimit?: number,
    usagePerUser?: number,
    validFrom?: Date,
    validTo?: Date,
  ) {
    this.code = code;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.maxDiscount = maxDiscount;
    this.minRideAmount = minRideAmount;
    this.usageLimit = usageLimit;
    this.usagePerUser = usagePerUser;
    this.validFrom = validFrom;
    this.validTo = validTo;
  }

  static fromRequest(body: unknown): CreateCouponDto {
    const parsed = (body ?? {}) as CreateCouponRequestBody;

    const dto = new CreateCouponDto(
      (parsed.code ?? "").trim().toUpperCase(),
      parsed.discountType as CouponDiscountType,
      parsed.discountValue as number,
      parsed.maxDiscount,
      parsed.minRideAmount,
      parsed.usageLimit,
      parsed.usagePerUser,
      parsed.validFrom ? new Date(parsed.validFrom) : undefined,
      parsed.validTo ? new Date(parsed.validTo) : undefined,
    );

    dto.validate();
    return dto;
  }

  validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw CouponErrors.invalidCouponData("Coupon code is required");
    }

    if (!Object.values(CouponDiscountType).includes(this.discountType)) {
      throw CouponErrors.invalidDiscountType(this.discountType ?? "");
    }

    if (this.discountValue === undefined || this.discountValue === null) {
      throw CouponErrors.invalidCouponData("Discount value is required");
    }

    if (this.discountValue <= 0) {
      throw CouponErrors.invalidDiscountValue(
        "Discount value must be greater than 0",
      );
    }

    if (
      this.discountType === CouponDiscountType.PERCENTAGE &&
      this.discountValue > 100
    ) {
      throw CouponErrors.invalidDiscountValue(
        "Percentage discount cannot exceed 100",
      );
    }

    if (this.maxDiscount !== undefined && this.maxDiscount < 0) {
      throw CouponErrors.invalidCouponData(
        "Max discount must be a positive value",
      );
    }

    if (this.minRideAmount !== undefined && this.minRideAmount < 0) {
      throw CouponErrors.invalidCouponData(
        "Min ride amount must be a positive value",
      );
    }

    if (this.usageLimit !== undefined && this.usageLimit < 0) {
      throw CouponErrors.invalidCouponData(
        "Usage limit must be a positive value",
      );
    }

    if (this.usagePerUser !== undefined && this.usagePerUser <= 0) {
      throw CouponErrors.invalidCouponData(
        "Usage per user must be greater than 0",
      );
    }

    if (this.validFrom && isNaN(this.validFrom.getTime())) {
      throw CouponErrors.invalidCouponData("validFrom is not a valid date");
    }

    if (this.validTo && isNaN(this.validTo.getTime())) {
      throw CouponErrors.invalidCouponData("validTo is not a valid date");
    }

    if (this.validFrom && this.validTo && this.validFrom >= this.validTo) {
      throw CouponErrors.invalidValidityPeriod();
    }
  }
}
