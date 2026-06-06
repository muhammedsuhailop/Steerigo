export class RideTimeline {
  private readonly requestedAt: Date;
  private acceptedAt?: Date;
  private arrivedAt?: Date;
  private startedAt?: Date;
  private completedAt?: Date;
  private cancelledAt?: Date;
  private rejectedAt?: Date;

  private paymentInitiatedAt?: Date;
  private paymentCompletedAt?: Date;
  private paymentFailedAt?: Date;
  private paymentRefundedAt?: Date;

  constructor(requestedAt: Date) {
    this.requestedAt = requestedAt;
  }

  public setAcceptedAt(date: Date): void {
    if (this.acceptedAt) throw new Error("Ride already accepted");
    this.acceptedAt = date;
  }

  public setArrivedAt(date: Date): void {
    if (!this.acceptedAt)
      throw new Error("Driver cannot arrive before accepting the ride");

    if (this.arrivedAt) throw new Error("Driver already marked as arrived");

    this.arrivedAt = date;
  }

  public setStartedAt(date: Date): void {
    if (!this.arrivedAt)
      throw new Error("Ride cannot start before driver arrival");

    if (this.startedAt) throw new Error("Ride already started");

    this.startedAt = date;
  }

  public setCompletedAt(date: Date): void {
    if (!this.startedAt)
      throw new Error("Ride cannot complete before being started");

    if (this.completedAt) throw new Error("Ride already completed");

    this.completedAt = date;

    this.paymentFailedAt = undefined;
  }

  public setCancelledAt(date: Date): void {
    if (this.completedAt || this.cancelledAt)
      throw new Error("Ride already ended");

    this.cancelledAt = date;
  }

  public setRejectedAt(date: Date): void {
    if (this.acceptedAt)
      throw new Error("Cannot reject after ride is accepted");

    this.rejectedAt = date;
  }

  public setPaymentInitiatedAt(date: Date): void {
    if (!this.completedAt && !this.cancelledAt)
      throw new Error(
        "Payment cannot start before ride completion or cancellation",
      );

    this.paymentInitiatedAt = date;
  }

  public setPaymentCompletedAt(date: Date): void {
    if (!this.paymentInitiatedAt)
      throw new Error("Payment cannot complete before initiation");

    this.paymentCompletedAt = date;
  }

  public setPaymentFailedAt(date: Date): void {
    if (!this.paymentInitiatedAt)
      throw new Error("Payment cannot fail before initiation");

    if (this.paymentCompletedAt) return;
    this.paymentFailedAt = date;
  }

  public setPaymentRefundedAt(date: Date): void {
    if (!this.paymentCompletedAt)
      throw new Error("Refund can only happen after successful payment");

    this.paymentRefundedAt = date;
  }

  public getRequestedAt(): Date {
    return this.requestedAt;
  }

  public getAcceptedAt(): Date | undefined {
    return this.acceptedAt;
  }

  public getArrivedAt(): Date | undefined {
    return this.arrivedAt;
  }

  public getStartedAt(): Date | undefined {
    return this.startedAt;
  }

  public getCompletedAt(): Date | undefined {
    return this.completedAt;
  }

  public getCancelledAt(): Date | undefined {
    return this.cancelledAt;
  }

  public getRejectedAt(): Date | undefined {
    return this.rejectedAt;
  }

  public getPaymentInitiatedAt(): Date | undefined {
    return this.paymentInitiatedAt;
  }

  public getPaymentCompletedAt(): Date | undefined {
    return this.paymentCompletedAt;
  }

  public getPaymentFailedAt(): Date | undefined {
    return this.paymentFailedAt;
  }

  public getPaymentRefundedAt(): Date | undefined {
    return this.paymentRefundedAt;
  }

  public getDuration(): number | null {
    return this.completedAt && this.startedAt
      ? this.completedAt.getTime() - this.startedAt.getTime()
      : null;
  }

  public getPaymentDuration(): number | null {
    return this.paymentCompletedAt && this.paymentInitiatedAt
      ? this.paymentCompletedAt.getTime() - this.paymentInitiatedAt.getTime()
      : null;
  }

  static fromData(data: {
    requestedAt?: Date;
    acceptedAt?: Date;
    arrivedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    rejectedAt?: Date;
    paymentInitiatedAt?: Date;
    paymentCompletedAt?: Date;
    paymentFailedAt?: Date;
    paymentRefundedAt?: Date;
  }): RideTimeline {
    const timeline = new RideTimeline(data.requestedAt || new Date());

    if (data.acceptedAt) timeline.setAcceptedAt(data.acceptedAt);
    if (data.arrivedAt) timeline.setArrivedAt(data.arrivedAt);
    if (data.startedAt) timeline.setStartedAt(data.startedAt);
    if (data.completedAt) timeline.setCompletedAt(data.completedAt);
    if (data.cancelledAt) timeline.setCancelledAt(data.cancelledAt);
    if (data.rejectedAt) timeline.setRejectedAt(data.rejectedAt);

    if (data.paymentInitiatedAt)
      timeline.setPaymentInitiatedAt(data.paymentInitiatedAt);

    if (data.paymentCompletedAt)
      timeline.setPaymentCompletedAt(data.paymentCompletedAt);

    if (data.paymentCompletedAt && data.paymentFailedAt) {
      timeline.setPaymentCompletedAt(data.paymentCompletedAt);
    } else {
      if (data.paymentCompletedAt)
        timeline.setPaymentCompletedAt(data.paymentCompletedAt);

      if (data.paymentFailedAt)
        timeline.setPaymentFailedAt(data.paymentFailedAt);
    }

    if (data.paymentRefundedAt)
      timeline.setPaymentRefundedAt(data.paymentRefundedAt);

    return timeline;
  }

  public toJSON() {
    return {
      requestedAt: this.requestedAt,
      acceptedAt: this.acceptedAt,
      arrivedAt: this.arrivedAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      cancelledAt: this.cancelledAt,
      rejectedAt: this.rejectedAt,
      paymentInitiatedAt: this.paymentInitiatedAt,
      paymentCompletedAt: this.paymentCompletedAt,
      paymentFailedAt: this.paymentFailedAt,
      paymentRefundedAt: this.paymentRefundedAt,
    };
  }
}
