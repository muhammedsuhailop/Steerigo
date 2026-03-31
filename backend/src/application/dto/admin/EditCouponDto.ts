import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { CouponErrors } from "@domain/errors/CouponErrors";

interface EditCouponRequestBody {
  discountType?: string;
  discountValue?: number;
  maxDiscount?: number | null;
  minRideAmount?: number | null;
  usageLimit?: number | null;
  usagePerUser?: number | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive?: boolean;
}

export class EditCouponDto {
  public readonly couponId: string;
  public readonly discountType?: CouponDiscountType;
  public readonly discountValue?: number;
  public readonly maxDiscount?: number | null;
  public readonly minRideAmount?: number | null;
  public readonly usageLimit?: number | null;
  public readonly usagePerUser?: number | null;
  public readonly validFrom?: Date | null;
  public readonly validTo?: Date | null;
  public readonly isActive?: boolean;

  private constructor(
    couponId: string,
    discountType?: CouponDiscountType,
    discountValue?: number,
    maxDiscount?: number | null,
    minRideAmount?: number | null,
    usageLimit?: number | null,
    usagePerUser?: number | null,
    validFrom?: Date | null,
    validTo?: Date | null,
    isActive?: boolean,
  ) {
    this.couponId = couponId;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.maxDiscount = maxDiscount;
    this.minRideAmount = minRideAmount;
    this.usageLimit = usageLimit;
    this.usagePerUser = usagePerUser;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.isActive = isActive;
  }

  static fromRequest(
    params: { couponId?: string },
    body: unknown,
  ): EditCouponDto {
    const parsed = (body ?? {}) as EditCouponRequestBody;

    const resolveDate = (
      val: string | null | undefined,
    ): Date | null | undefined => {
      if (val === null) return null;
      if (val === undefined) return undefined;
      return new Date(val);
    };

    const dto = new EditCouponDto(
      params.couponId as string,
      parsed.discountType as CouponDiscountType | undefined,
      parsed.discountValue,
      parsed.maxDiscount,
      parsed.minRideAmount,
      parsed.usageLimit,
      parsed.usagePerUser,
      resolveDate(parsed.validFrom),
      resolveDate(parsed.validTo),
      parsed.isActive,
    );

    dto.validate();
    return dto;
  }

  validate(): void {
    if (!this.couponId || this.couponId.trim().length === 0) {
      throw CouponErrors.invalidCouponData("Coupon ID is required");
    }

    if (
      this.discountType !== undefined &&
      !Object.values(CouponDiscountType).includes(this.discountType)
    ) {
      throw CouponErrors.invalidDiscountType(this.discountType);
    }

    if (this.discountValue !== undefined) {
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
    }

    if (
      this.maxDiscount !== undefined &&
      this.maxDiscount !== null &&
      this.maxDiscount <= 0
    ) {
      throw CouponErrors.invalidCouponData(
        "Max discount must be greater than 0",
      );
    }

    if (
      this.minRideAmount !== undefined &&
      this.minRideAmount !== null &&
      this.minRideAmount <= 0
    ) {
      throw CouponErrors.invalidCouponData(
        "Min ride amount must be greater than 0",
      );
    }

    if (
      this.usageLimit !== undefined &&
      this.usageLimit !== null &&
      this.usageLimit <= 0
    ) {
      throw CouponErrors.invalidCouponData(
        "Usage limit must be greater than 0",
      );
    }

    if (
      this.usagePerUser !== undefined &&
      this.usagePerUser !== null &&
      this.usagePerUser <= 0
    ) {
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
