export class UpdateUserStatusDto {
  public readonly userId: string;
  public readonly action:
    | "activate"
    | "suspend"
    | "deactivate"
    | "verify"
    | "block";

  constructor(data: any) {
    this.userId = data.userId;
    this.action = data.action;
  }

  getStatusFromAction(): string {
    switch (this.action) {
      case "activate":
        return "Active";
      case "suspend":
        return "Suspended";
      case "deactivate":
        return "Inactive";
      case "verify":
        return "Active";
      case "block":
        return "Blocked";
      default:
        throw new Error(`Invalid action: ${this.action}`);
    }
  }
}
