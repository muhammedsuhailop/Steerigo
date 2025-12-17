import { z } from "zod";
import {
  AvailabilityStatus,
  VALID_AVAILABILITY_STATUSES,
} from "@domain/value-objects/AvailabilityStatus";

const updateStatusSchema = z.object({
  driverId: z.string().min(1, "driverId is required"),
  status: z.enum(VALID_AVAILABILITY_STATUSES as [string, ...string[]], {
    message: `Status must be one of: ${VALID_AVAILABILITY_STATUSES.join(", ")}`,
  }),
});

type UpdateStatusData = z.infer<typeof updateStatusSchema>;

export class UpdateStatusRequestDto {
  private readonly data: UpdateStatusData;

  constructor(requestData: unknown) {
    this.data = updateStatusSchema.parse(requestData);
  }

  static fromRequest(requestBody: unknown): UpdateStatusRequestDto {
    return new UpdateStatusRequestDto(requestBody);
  }
 
  getStatus(): AvailabilityStatus {
    return this.data.status as AvailabilityStatus;
  }

  getDriverId(): string {
    return this.data.driverId;
  }
}
