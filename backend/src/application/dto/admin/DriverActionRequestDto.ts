import { z } from "zod";

const driverActionRequestSchema = z.object({
  driverId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  action: z.enum(["block", "suspend", "activate"], {
      message: "Action must be one of: block, suspend, activate",
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

  getAction(): "block" | "suspend" | "activate" {
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

    if (this.data.action === "block" && !this.data.reason) {
      errors.push("Reason is required for block action");
    }

    return errors;
  }
}
