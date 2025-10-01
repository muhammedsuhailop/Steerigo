export class DriverActionDto {
  public readonly driverId: string;
  public readonly action: "block" | "unblock" | "inreview";

  constructor(data: any) {
    this.driverId = data.driverId;
    this.action = data.action;
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
