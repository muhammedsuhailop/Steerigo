import { z } from "zod";

const driverActionRequestSchema = z.object({
  driverId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid driver ID format"),
  action: z.enum(["approve", "suspend", "activate", "reject"], {
    message: "Action must be one of: approve, suspend, activate, reject",
  }),
  reason: z.string().min(1).max(500).optional(),
});

type DriverActionRequestData = z.infer<typeof driverActionRequestSchema>;

export class DriverActionRequestDto {
  private readonly data: DriverActionRequestData;

  constructor(requestData: any) {
    this.data = driverActionRequestSchema.parse(requestData);
  }

  getDriverId(): string {
    return this.data.driverId;
  }

  getAction(): "approve" | "suspend" | "activate" | "reject" {
    return this.data.action;
  }

  getReason(): string | undefined {
    return this.data.reason;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.data.action === "suspend" && !this.data.reason) {
      errors.push("Reason is required for suspend action");
    }

    if (this.data.action === "reject" && !this.data.reason) {
      errors.push("Reason is required for reject action");
    }

    return errors;
  }
}
