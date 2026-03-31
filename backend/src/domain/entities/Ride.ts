import { CouponDetails } from "@domain/value-objects/CouponDetails";
import { CouponDiscountType } from "@domain/value-objects/CouponDiscountType";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { Location } from "@domain/value-objects/Location";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { RideType } from "@domain/value-objects/RideType";

export class Ride {
  private constructor(
    private readonly id: string,
    private readonly rideId: string,
    private readonly driverId: string,
    private readonly riderId: string,
    private status: RideStatus,
    private paymentStatus: PaymentStatus,
    private readonly pickup: Location,
    private readonly drop: Location,
    private readonly rideType: RideType,
    private fareBreakdown: FareBreakdown,
    private readonly currency: string = "INR",
    private readonly timeline: RideTimeline,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
    private couponDetails?: CouponDetails,
  ) {}

  static create(
    id: string,
    rideId: string,
    driverId: string,
    riderId: string,
    pickup: Location,
    drop: Location,
    rideType: RideType,
    fareBreakdown: FareBreakdown,
    timeline: RideTimeline,
  ): Ride {
    if (!id || !rideId || !driverId || !riderId) {
      throw new Error("All ID fields are required");
    }
    if (!rideType || rideType.trim() === "") {
      throw new Error("Ride type is required");
    }
    return new Ride(
      id,
      rideId,
      driverId,
      riderId,
      RideStatus.REQUESTED,
      PaymentStatus.PENDING,
      pickup,
      drop,
      rideType,
      fareBreakdown,
      "INR",
      timeline,
      undefined,
    );
  }

  static fromData(data: {
    id: string;
    rideId: string;
    driverId: string;
    riderId: string;
    status: RideStatus;
    paymentStatus: PaymentStatus;
    pickup: Location;
    drop: Location;
    rideType: RideType;
    fareBreakdown: FareBreakdown;
    currency: string;
    timeline: RideTimeline;
    createdAt: Date;
    updatedAt: Date;
    couponDetails?: CouponDetails;
  }): Ride {
    return new Ride(
      data.id,
      data.rideId,
      data.driverId,
      data.riderId,
      data.status,
      data.paymentStatus,
      data.pickup,
      data.drop,
      data.rideType,
      data.fareBreakdown,
      data.currency,
      data.timeline,
      data.createdAt,
      data.updatedAt,
      data.couponDetails,
    );
  }

  getId(): string {
    return this.id;
  }
  getRideId(): string {
    return this.rideId;
  }
  getDriverId(): string {
    return this.driverId;
  }
  getRiderId(): string {
    return this.riderId;
  }
  getStatus(): RideStatus {
    return this.status;
  }
  getPickup(): Location {
    return this.pickup;
  }
  getDrop(): Location {
    return this.drop;
  }
  getRideType(): RideType {
    return this.rideType;
  }
  getFareBreakdown(): FareBreakdown {
    return this.fareBreakdown;
  }
  getCurrency(): string {
    return this.currency;
  }
  getTimeline(): RideTimeline {
    return this.timeline;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  getFare(): number {
    return this.fareBreakdown.getTotalFare().getAmount();
  }
  getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  getCouponDetails(): CouponDetails | undefined {
    return this.couponDetails;
  }

  hasCouponApplied(): boolean {
    return !!this.couponDetails;
  }

  // Status checks
  isRequested(): boolean {
    return this.status === RideStatus.REQUESTED;
  }
  isAccepted(): boolean {
    return this.status === RideStatus.ACCEPTED;
  }
  isArrived(): boolean {
    return this.status === RideStatus.ARRIVED;
  }
  isStarted(): boolean {
    return this.status === RideStatus.STARTED;
  }
  isCompleted(): boolean {
    return this.status === RideStatus.COMPLETED;
  }
  isCancelled(): boolean {
    return this.status === RideStatus.CANCELLED;
  }

  // Timeline convenience getters
  getArrivedAt(): Date | undefined {
    return this.timeline.getArrivedAt();
  }
  getStartedAt(): Date | undefined {
    return this.timeline.getStartedAt();
  }
  getCompletedAt(): Date | undefined {
    return this.timeline.getCompletedAt();
  }
  getCancelledAt(): Date | undefined {
    return this.timeline.getCancelledAt();
  }

  getRideDurationMs(): number | undefined {
    const startedAt = this.getStartedAt();
    const completedAt = this.getCompletedAt();
    if (!startedAt || !completedAt) return undefined;
    return completedAt.getTime() - startedAt.getTime();
  }

  getFormattedRideDuration(): string {
    const durationMs = this.getRideDurationMs();
    if (!durationMs) return "00:00:00";
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  getElapsedTimeFromStart(): string {
    const startedAt = this.getStartedAt();
    if (!startedAt) return "00:00:00";
    const diff = new Date().getTime() - startedAt.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Status transitions
  setStatusToAccepted(): void {
    if (this.status !== RideStatus.REQUESTED) {
      throw new Error("Only requested rides can be accepted");
    }
    this.status = RideStatus.ACCEPTED;
  }

  setStatusToArrived(): void {
    if (!this.isAccepted()) {
      throw new Error("Only accepted rides can be marked as arrived");
    }
    this.status = RideStatus.ARRIVED;
    this.timeline.setArrivedAt(new Date());
  }

  setStatusToStarted(): void {
    if (!this.isAccepted() && !this.isArrived()) {
      throw new Error("Only accepted or arrived rides can be started");
    }
    if (this.isAccepted() && !this.timeline.getArrivedAt()) {
      this.timeline.setArrivedAt(new Date());
    }
    this.status = RideStatus.STARTED;
    this.timeline.setStartedAt(new Date());
  }

  completeWithFareBreakdown(finalFareBreakdown: FareBreakdown): void {
    if (!this.isStarted()) {
      throw new Error("Only started rides can be completed");
    }
    this.fareBreakdown = finalFareBreakdown;
    this.status = RideStatus.COMPLETED;
    this.timeline.setCompletedAt(new Date());
  }

  setStatusToCompleted(): void {
    if (!this.isStarted()) {
      throw new Error("Only started rides can be completed");
    }
    this.status = RideStatus.COMPLETED;
    this.timeline.setCompletedAt(new Date());
  }

  setStatusToCancelled(): void {
    if (this.isCancelled()) {
      throw new Error("Ride is already cancelled");
    }
    this.status = RideStatus.CANCELLED;
    this.timeline.setCancelledAt(new Date());
  }

  cancelWithFareBreakdown(resolvedFare: FareBreakdown): void {
    if (this.isCancelled()) {
      throw new Error("Ride is already cancelled");
    }
    if (this.isCompleted()) {
      throw new Error("Completed rides cannot be cancelled");
    }
    if (this.isStarted()) {
      throw new Error("Started rides cannot be cancelled by rider");
    }

    this.fareBreakdown = resolvedFare;
    this.status = RideStatus.CANCELLED;
    this.timeline.setCancelledAt(new Date());
  }

  cancelByDriver(resolvedFare: FareBreakdown): void {
    if (this.isCancelled()) {
      throw new Error("Ride is already cancelled");
    }
    if (this.isCompleted()) {
      throw new Error("Completed rides cannot be cancelled");
    }

    this.fareBreakdown = resolvedFare;
    this.status = RideStatus.CANCELLED;
    this.timeline.setCancelledAt(new Date());
  }

  applyCoupon(
    couponId: string,
    code: string,
    discountAmount: number,
    discountType: CouponDiscountType,
  ): void {
    if (this.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error(
        "Cannot apply coupon: Payment is already processed or completed.",
      );
    }

    if (this.couponDetails) {
      throw new Error("Coupon already applied to this ride.");
    }

    if (discountAmount <= 0) {
      throw new Error("Discount amount must be greater than zero.");
    }

    const fare = this.getFare();
    if (discountAmount > fare) {
      throw new Error("Discount cannot exceed total fare.");
    }

    this.couponDetails = {
      couponId,
      code,
      discountAmount,
      discountType,
    };
  }

  removeCoupon(): void {
    if (this.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error(
        "Cannot remove coupon: Payment is already processed or completed.",
      );
    }

    if (!this.couponDetails) {
      throw new Error("No coupon applied to remove.");
    }

    this.couponDetails = undefined;
  }

  getDiscountAmount(): number {
    return this.couponDetails?.discountAmount ?? 0;
  }

  getPayableAmount(): number {
    const payable = this.getFare() - this.getDiscountAmount();

    return Math.max(0, payable);
  }

  updatePaymentStatus(status: PaymentStatus): void {
    this.paymentStatus = status;
  }
}
