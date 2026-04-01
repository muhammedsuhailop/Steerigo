export class CouponUsage {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly couponId: string,
    private readonly rideId: string,
    private readonly discountAmount: number,
    private readonly usedAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    couponId: string;
    rideId: string;
    discountAmount: number;
    usedAt?: Date;
  }): CouponUsage {
    if (!params.userId || !params.couponId || !params.rideId) {
      throw new Error("Invalid coupon usage data");
    }

    return new CouponUsage(
      params.id,
      params.userId,
      params.couponId,
      params.rideId,
      params.discountAmount,
      params.usedAt ?? new Date(),
    );
  }

  static fromData(data: {
    id: string;
    userId: string;
    couponId: string;
    rideId: string;
    discountAmount: number;
    usedAt: Date;
  }): CouponUsage {
    return new CouponUsage(
      data.id,
      data.userId,
      data.couponId,
      data.rideId,
      data.discountAmount,
      data.usedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getCouponId(): string {
    return this.couponId;
  }

  getRideId(): string {
    return this.rideId;
  }

  getUsedAt(): Date {
    return this.usedAt;
  }

  getdiscountAmount(): number {
    return this.discountAmount;
  }
}
