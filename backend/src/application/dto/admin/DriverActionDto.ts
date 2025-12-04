export interface DriverActionInput {
  driverId: string;
  action: "block" | "unblock" | "inreview";
  reason?:string;
}

export class DriverActionDto {
  public readonly driverId: string;
  public readonly action: "block" | "unblock" | "inreview";
  public readonly reason?:string;

  constructor(data: DriverActionInput) {
    this.driverId = data.driverId;
    this.action = data.action;
    this.reason = data.reason;
  }

  getStatusFromAction(): "Active" | "Blocked" | "InReview" {
    switch (this.action) {
      case "block":
        return "Blocked";
      case "unblock":
        return "Active";
      case "inreview":
        return "InReview";
      default:
        throw new Error(`Invalid action: ${this.action}`);
    }
  }
}
