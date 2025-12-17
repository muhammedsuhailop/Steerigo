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

interface DriverActionRequestBody {
  action: "block" | "suspend" | "activate";
  reason?: string;
}


type DriverActionRequestData = z.infer<typeof driverActionRequestSchema>;

export class DriverActionRequestDto {
  private readonly data: DriverActionRequestData;

  constructor(requestData: unknown) {
    this.data = driverActionRequestSchema.parse(requestData);
  }

  static fromRequest(
    driverId: string,
    requestBody: unknown
  ): DriverActionRequestDto {

    const body = (requestBody ?? {}) as DriverActionRequestBody;

    const mergedData = {
      driverId,
      action: body.action,
      reason: body.reason,
    };

    return new DriverActionRequestDto(mergedData);
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

    // Additional reason validation
    if (this.data.reason) {
      if (this.data.reason.length < 1) {
        errors.push("Reason, if provided, cannot be empty");
      }
      if (this.data.reason.length > 500) {
        errors.push("Reason cannot be longer than 500 characters");
      }
    }

    return errors;
  }
}
